<?php
declare(strict_types=1);

require_once __DIR__ . '/../public/api/lead.php';

function expect(bool $condition, string $message): void
{
    if (!$condition) {
        fwrite(STDERR, "FAIL: {$message}\n");
        exit(1);
    }
}

function lead(array $changes = []): array
{
    return array_merge([
        'name' => 'Иван Петров',
        'phone' => '+7 (950) 701-82-52',
        'message' => 'Нужна диагностика вариатора.',
        'source' => 'hero',
        'consent' => true,
        'website' => '',
    ], $changes);
}

$rateDirectory = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'cvt-lead-test-' . bin2hex(random_bytes(8));
$sent = 0;
$email = static function (string $message) use (&$sent): bool { $sent++; return $message !== ''; };

$valid = cvtHandleLead(lead(), '203.0.113.10', $rateDirectory, $email);
expect($valid['status'] === 200 && $sent === 1, 'valid lead is accepted without real delivery');

$failedEmail = cvtHandleLead(lead(), '203.0.113.20', $rateDirectory, static function (string $message): bool { return false; });
expect($failedEmail['status'] === 502 && $failedEmail['body']['ok'] === false, 'email delivery failure is reported safely');

$multiline = cvtValidateLead(lead(['message' => "Первая строка\r\nВторая строка\rТретья строка"]));
expect(($multiline['valid'] ?? false) && $multiline['message'] === "Первая строка\nВторая строка\nТретья строка", 'multiline message is normalized');
expect(cvtValidateLead(lead(['consent' => false]))['valid'] === false, 'consent is required');
expect(cvtValidateLead(lead(['source' => 'other']))['valid'] === false, 'unknown source is rejected');
expect(cvtValidateLead(lead(['name' => 'А']))['valid'] === false, 'short name is rejected');
expect(cvtValidateLead(lead(['phone' => 'abc1234567']))['valid'] === false, 'letters in phone are rejected');
expect(cvtValidateLead(lead(['phone' => '+7 123']))['valid'] === false, 'short phone is rejected');
expect(cvtValidateLead(lead(['phone' => '+7 (999) 000-00-0']))['valid'] === false, 'partial formatted phone is rejected');
expect(cvtValidateLead(lead(['phone' => '8 (999) 000-00-00']))['valid'] === false, 'unformatted trunk-prefix phone is rejected');
expect(cvtValidateLead(lead(['message' => str_repeat('а', 1001)]))['valid'] === false, 'long message is rejected');
expect(cvtValidateLead(lead(['name' => ['array']]))['valid'] === false, 'array input is rejected');
expect(cvtIsJsonContentType('application/json'), 'plain JSON content type is accepted');
expect(cvtIsJsonContentType(' Application/JSON ; Charset = UTF-8 '), 'JSON UTF-8 content type accepts whitespace and case');
expect(!cvtIsJsonContentType('application/jsonp'), 'JSONP content type is rejected');
expect(!cvtIsJsonContentType('application/json-patch+json'), 'JSON Patch content type is rejected');

$honeypot = cvtHandleLead(lead(['website' => 'https://spam.example']), '203.0.113.11', $rateDirectory, $email);
expect($honeypot['status'] === 200 && $sent === 1 && $honeypot['body']['ok'] === false, 'honeypot rejects neutrally without delivery or false success');
expect(!str_contains($honeypot['body']['message'], 'Заявка отправлена'), 'honeypot response does not claim success');

// Exercise the complete request boundary with a mock sender, never mail().
$requestIndex = 30;
$baseServer = ['REQUEST_METHOD' => 'POST', 'CONTENT_TYPE' => 'application/json'];
$rejected = static function (string $body, array $headers, int $status) use (&$requestIndex, &$sent, $baseServer, $rateDirectory, $email): void {
    $before = $sent;
    $server = array_merge($baseServer, ['REMOTE_ADDR' => '203.0.113.' . $requestIndex++], $headers);
    $response = cvtHandleRequest($server, $body, $rateDirectory, $email);
    expect($response['status'] === $status && $response['body']['ok'] === false, 'request rejected with expected status ' . $status);
    expect($sent === $before, 'rejected request never invokes email sender');
};
$body = json_encode(lead(), JSON_UNESCAPED_UNICODE);
$rejected($body, ['REQUEST_METHOD' => 'GET'], 405);
$rejected('{broken', [], 400);
$rejected($body, ['CONTENT_TYPE' => 'text/plain'], 400);
$rejected($body, ['CONTENT_TYPE' => 'application/jsonp'], 400);
$rejected(str_repeat('x', CVT_MAX_REQUEST_BYTES + 1), [], 400);
$rejected($body, ['CONTENT_LENGTH' => (string) (CVT_MAX_REQUEST_BYTES + 1)], 400);
$rejected('', [], 400);
$rejected('null', [], 422);
$rejected('[]', [], 422);
$rejected($body, ['HTTP_ORIGIN' => 'https://remontvariator.ru.attacker.example'], 403);
$rejected($body, ['HTTP_REFERER' => 'https://attacker.example/'], 403);
$rejected($body, ['HTTP_ORIGIN' => 'null'], 403);
foreach (['97', '67', '49771798', '', '+7 (999) 999-99', '+7 (999) 999-99-999', '+7 (999) 999-99-99abc'] as $phone) {
    $rejected(json_encode(lead(['phone' => $phone])), [], 422);
}
foreach ([['consent' => false], ['consent' => 'true'], ['name' => "Иван\r\nBcc: test@example.invalid"], ['name' => str_repeat('а', 81)], ['message' => str_repeat('а', 1001)], ['message' => "Нулевой\0байт"]] as $changes) {
    $rejected(json_encode(lead($changes)), [], 422);
}
$rejected(json_encode(lead(['website' => 'bot'])), [], 200);
foreach (['https://remontvariator.ru', 'https://www.remontvariator.ru'] as $origin) {
    $response = cvtHandleRequest(array_merge($baseServer, ['REMOTE_ADDR' => '203.0.113.' . $requestIndex++, 'HTTP_ORIGIN' => $origin, 'HTTP_REFERER' => $origin . '/?utm_source=test']), $body, $rateDirectory, $email);
    expect($response['status'] === 200 && $response['body']['ok'] === true, 'same-site HTTPS requests accepted using mock sender');
}
$beforeLimited = $sent;
for ($attempt = 0; $attempt < 6; $attempt++) {
    $response = cvtHandleRequest(array_merge($baseServer, ['REMOTE_ADDR' => '203.0.113.90', 'HTTP_X_FORWARDED_FOR' => '198.51.100.' . $attempt]), '{broken', $rateDirectory, $email);
    expect($response['status'] === ($attempt < 5 ? 400 : 429), 'invalid attempts count towards limit and spoofed forwarding headers cannot bypass it');
}
$response = cvtHandleRequest(array_merge($baseServer, ['REMOTE_ADDR' => '203.0.113.90']), $body, $rateDirectory, $email);
expect($response['status'] === 429 && $sent === $beforeLimited, 'over-limit valid request never reaches sender');
$ratePath = $rateDirectory . DIRECTORY_SEPARATOR . hash('sha256', '203.0.113.90') . '.json';
$rateData = json_decode(file_get_contents($ratePath), true);
expect(count($rateData) === 5 && count(array_filter($rateData, 'is_int')) === 5, 'rate storage contains only timestamps under a hashed IP filename');
expect(!str_contains(file_get_contents($ratePath), '203.0.113.90'), 'raw IP is not stored');
expect(cvtEncodeHeader('Тема') === '=?UTF-8?B?' . base64_encode('Тема') . '?=', 'subject is safely encoded');

for ($attempt = 0; $attempt < CVT_RATE_LIMIT_ATTEMPTS; $attempt++) {
    $result = cvtConsumeRateLimit('203.0.113.12', $rateDirectory, 1000);
    expect($result['allowed'] === true, 'rate limit allows configured attempts');
}
$limited = cvtConsumeRateLimit('203.0.113.12', $rateDirectory, 1000);
expect($limited['allowed'] === false && $limited['status'] === 429 && ($limited['retry_after'] ?? 0) > 0, 'rate limit rejects excess attempts');

$staleRateFile = $rateDirectory . DIRECTORY_SEPARATOR . hash('sha256', '203.0.113.99') . '.json';
$foreignFile = $rateDirectory . DIRECTORY_SEPARATOR . 'keep.txt';
file_put_contents($staleRateFile, '[]');
touch($staleRateFile, 100);
file_put_contents($foreignFile, 'keep');
cvtCleanupRateLimitDirectory($rateDirectory, 1000, 1);
expect(!is_file($staleRateFile), 'cleanup removes stale rate-limit JSON files');
expect(is_file($foreignFile), 'cleanup leaves unrelated files untouched');

foreach (glob($rateDirectory . DIRECTORY_SEPARATOR . '*.json') ?: [] as $file) {
    @unlink($file);
}
@unlink($foreignFile);
@rmdir($rateDirectory);
echo "PHP lead handler tests passed\n";
