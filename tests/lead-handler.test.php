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
expect(cvtValidateLead(lead(['message' => str_repeat('а', 1001)]))['valid'] === false, 'long message is rejected');
expect(cvtValidateLead(lead(['name' => ['array']]))['valid'] === false, 'array input is rejected');
expect(cvtIsJsonContentType('application/json'), 'plain JSON content type is accepted');
expect(cvtIsJsonContentType(' Application/JSON ; Charset = UTF-8 '), 'JSON UTF-8 content type accepts whitespace and case');
expect(!cvtIsJsonContentType('application/jsonp'), 'JSONP content type is rejected');
expect(!cvtIsJsonContentType('application/json-patch+json'), 'JSON Patch content type is rejected');

$honeypot = cvtHandleLead(lead(['website' => 'https://spam.example']), '203.0.113.11', $rateDirectory, $email);
expect($honeypot['status'] === 200 && $sent === 1, 'honeypot returns neutral success without delivery');

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
