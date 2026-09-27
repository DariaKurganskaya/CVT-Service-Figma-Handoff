<?php
declare(strict_types=1);

const CVT_MAX_REQUEST_BYTES = 8192;
const CVT_RATE_LIMIT_ATTEMPTS = 5;
const CVT_RATE_LIMIT_WINDOW = 600;
const CVT_LEAD_EMAIL = 'info@remontvariator.ru';
const CVT_LEAD_SUBJECT = 'Новая заявка с remontvariator.ru';

function cvtTextLength(string $value): int
{
    if (function_exists('mb_strlen')) {
        return mb_strlen($value, 'UTF-8');
    }

    $characters = [];
    $count = preg_match_all('/./u', $value, $characters);

    return $count === false ? -1 : $count;
}

function cvtReadSingleLine(array $payload, string $key, int $maxLength): ?string
{
    if (!array_key_exists($key, $payload) || !is_string($payload[$key])) {
        return null;
    }

    $value = trim($payload[$key]);
    if (preg_match('/[\x00-\x1F\x7F]/', $value) === 1 || cvtTextLength($value) > $maxLength) {
        return null;
    }

    return $value;
}

function cvtReadMessage(array $payload): ?string
{
    if (!array_key_exists('message', $payload) || !is_string($payload['message'])) {
        return null;
    }

    $message = str_replace(["\r\n", "\r"], "\n", $payload['message']);
    if (preg_match('/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/', $message) === 1 || cvtTextLength($message) > 1000) {
        return null;
    }

    return trim($message);
}

function cvtIsList(array $value): bool
{
    $expectedKey = 0;
    foreach ($value as $key => $_) {
        if ($key !== $expectedKey) {
            return false;
        }
        $expectedKey++;
    }

    return true;
}

function cvtIsJsonContentType(string $contentType): bool
{
    return preg_match('/^\s*application\/json\s*(?:;\s*charset\s*=\s*utf-8\s*)?$/iD', $contentType) === 1;
}

function cvtValidateLead(array $payload): array
{
    if (cvtIsList($payload)) {
        return ['valid' => false];
    }

    $website = $payload['website'] ?? '';
    if (!is_string($website)) {
        return ['valid' => false];
    }

    if (trim($website) !== '') {
        return ['valid' => true, 'honeypot' => true];
    }

    $name = cvtReadSingleLine($payload, 'name', 80);
    $phone = cvtReadSingleLine($payload, 'phone', 40);
    $message = cvtReadMessage($payload);
    $source = cvtReadSingleLine($payload, 'source', 20);
    $consent = $payload['consent'] ?? null;

    if (
        $name === null || cvtTextLength($name) < 2 ||
        $phone === null || preg_match('/^\+7 \([0-9]{3}\) [0-9]{3}-[0-9]{2}-[0-9]{2}$/D', $phone) !== 1 ||
        $message === null ||
        !in_array($source, ['hero', 'contact'], true) ||
        $consent !== true
    ) {
        return ['valid' => false];
    }

    return [
        'valid' => true,
        'honeypot' => false,
        'name' => $name,
        'phone' => $phone,
        'message' => $message,
        'source' => $source,
    ];
}

function cvtRateLimitDirectory(): string
{
    return rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'cvt-remontvariator-rate-limit';
}

function cvtCleanupRateLimitDirectory(string $directory, int $now, int $sampleRate = 20): void
{
    if ($sampleRate < 1) {
        $sampleRate = 1;
    }

    if ($sampleRate > 1 && random_int(1, $sampleRate) !== 1) {
        return;
    }

    try {
        $entries = new FilesystemIterator($directory, FilesystemIterator::SKIP_DOTS);
        $checked = 0;
        foreach ($entries as $entry) {
            if ($checked >= 12) {
                break;
            }

            $filename = $entry->getFilename();
            if (!preg_match('/^[a-f0-9]{64}\.json$/D', $filename)) {
                continue;
            }

            $checked++;
            if ($entry->getMTime() < $now - CVT_RATE_LIMIT_WINDOW) {
                @unlink($entry->getPathname());
            }
        }
    } catch (UnexpectedValueException) {
        // Rate limiting remains available even if optional stale-file cleanup cannot run.
    }
}

function cvtConsumeRateLimit(string $ip, string $directory, ?int $now = null): array
{
    $now = $now ?? time();
    if ($ip === '' || !filter_var($ip, FILTER_VALIDATE_IP)) {
        return ['allowed' => false, 'status' => 503];
    }

    if (!is_dir($directory) && !@mkdir($directory, 0700, true) && !is_dir($directory)) {
        return ['allowed' => false, 'status' => 503];
    }

    $path = $directory . DIRECTORY_SEPARATOR . hash('sha256', $ip) . '.json';
    $handle = @fopen($path, 'c+');
    if ($handle === false || !@flock($handle, LOCK_EX)) {
        if (is_resource($handle)) {
            fclose($handle);
        }
        return ['allowed' => false, 'status' => 503];
    }

    $raw = stream_get_contents($handle);
    $stored = is_string($raw) ? json_decode($raw, true) : [];
    $timestamps = is_array($stored) ? array_values(array_filter($stored, static function ($timestamp) use ($now): bool {
        return is_int($timestamp) && $timestamp > $now - CVT_RATE_LIMIT_WINDOW;
    })) : [];

    if (count($timestamps) >= CVT_RATE_LIMIT_ATTEMPTS) {
        sort($timestamps, SORT_NUMERIC);
        @flock($handle, LOCK_UN);
        fclose($handle);
        return ['allowed' => false, 'status' => 429, 'retry_after' => max(1, $timestamps[0] + CVT_RATE_LIMIT_WINDOW - $now)];
    }

    $timestamps[] = $now;
    rewind($handle);
    if (!@ftruncate($handle, 0) || @fwrite($handle, json_encode($timestamps)) === false || !@fflush($handle)) {
        @flock($handle, LOCK_UN);
        fclose($handle);
        return ['allowed' => false, 'status' => 503];
    }
    @flock($handle, LOCK_UN);
    fclose($handle);

    cvtCleanupRateLimitDirectory($directory, $now);

    return ['allowed' => true];
}

function cvtEncodeHeader(string $value): string
{
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

function cvtBuildLeadMessage(array $lead): string
{
    $sources = ['hero' => 'Форма первого экрана', 'contact' => 'Форма контактов'];

    return implode("\n", [
        'Новая заявка с remontvariator.ru',
        '',
        'Имя: ' . $lead['name'],
        'Телефон: ' . $lead['phone'],
        'Сообщение: ' . ($lead['message'] === '' ? 'Не указано' : $lead['message']),
        'Источник: ' . $sources[$lead['source']],
        'Время сервера: ' . date('c'),
    ]);
}

function cvtSendEmail(string $message): bool
{
    $headers = implode("\r\n", [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'From: ' . cvtEncodeHeader('CVT Сервис') . ' <' . CVT_LEAD_EMAIL . '>',
        'Reply-To: ' . CVT_LEAD_EMAIL,
    ]);

    return @mail(CVT_LEAD_EMAIL, cvtEncodeHeader(CVT_LEAD_SUBJECT), $message, $headers);
}

function cvtRateLimitResponse(string $ip, string $rateDirectory): ?array
{
    $rate = cvtConsumeRateLimit($ip, $rateDirectory);
    if ($rate['allowed'] ?? false) {
        return null;
    }
    $message = $rate['status'] === 429
        ? 'Слишком много попыток. Подождите 10 минут или позвоните нам.'
        : 'Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.';
    return ['status' => $rate['status'], 'retry_after' => $rate['retry_after'] ?? null, 'body' => ['ok' => false, 'message' => $message]];
}

function cvtDeliverValidatedLead(array $payload, callable $emailSender): array
{
    $lead = cvtValidateLead($payload);
    if (!($lead['valid'] ?? false)) {
        return ['status' => 422, 'body' => ['ok' => false, 'message' => 'Проверьте данные заявки и подтвердите согласие.']];
    }
    if ($lead['honeypot'] ?? false) {
        // Neutral rejection: no delivery, success UI, or successful-lead signal.
        return ['status' => 200, 'body' => ['ok' => false, 'message' => 'Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.']];
    }

    $message = cvtBuildLeadMessage($lead);
    if (!$emailSender($message)) {
        return ['status' => 502, 'body' => ['ok' => false, 'message' => 'Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.']];
    }

    return ['status' => 200, 'body' => ['ok' => true, 'message' => 'Заявка отправлена. Мы свяжемся с вами в ближайшее время.']];
}

function cvtHandleLead(array $payload, string $ip, string $rateDirectory, callable $emailSender): array
{
    return cvtRateLimitResponse($ip, $rateDirectory) ?? cvtDeliverValidatedLead($payload, $emailSender);
}

function cvtTrustedPageHeader(string $url, bool $origin): bool
{
    $parts = parse_url($url);
    return is_array($parts)
        && ($parts['scheme'] ?? '') === 'https'
        && in_array(strtolower($parts['host'] ?? ''), ['remontvariator.ru', 'www.remontvariator.ru'], true)
        && (!isset($parts['port']) || $parts['port'] === 443)
        && !isset($parts['user']) && !isset($parts['pass'])
        && (!$origin || ((!isset($parts['path']) || $parts['path'] === '/') && !isset($parts['query']) && !isset($parts['fragment'])));
}

/** Same request path in production and tests; the sender is injected, never client-controlled. */
function cvtHandleRequest(array $server, string $rawBody, string $rateDirectory, callable $emailSender): array
{
    if (($server['REQUEST_METHOD'] ?? '') !== 'POST') {
        return ['status' => 405, 'body' => ['ok' => false, 'message' => 'Метод не поддерживается.']];
    }

    // Count every POST attempt, including malformed requests and honeypots.
    // Ignore client-supplied forwarding headers: REMOTE_ADDR is supplied by PHP.
    $limited = cvtRateLimitResponse((string) ($server['REMOTE_ADDR'] ?? ''), $rateDirectory);
    if ($limited !== null) return $limited;

    foreach (['HTTP_ORIGIN' => true, 'HTTP_REFERER' => false] as $header => $origin) {
        if (isset($server[$header]) && (!is_string($server[$header]) || !cvtTrustedPageHeader($server[$header], $origin))) {
            return ['status' => 403, 'body' => ['ok' => false, 'message' => 'Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.']];
        }
    }

    $contentLength = $server['CONTENT_LENGTH'] ?? null;
    $contentType = $server['CONTENT_TYPE'] ?? '';
    if ((is_string($contentLength) && ctype_digit($contentLength) && (int) $contentLength > CVT_MAX_REQUEST_BYTES) || !is_string($contentType) || !cvtIsJsonContentType($contentType) || strlen($rawBody) === 0 || strlen($rawBody) > CVT_MAX_REQUEST_BYTES) {
        return ['status' => 400, 'body' => ['ok' => false, 'message' => 'Некорректный формат заявки.']];
    }
    try {
        $payload = json_decode($rawBody, true, 32, JSON_THROW_ON_ERROR);
    } catch (JsonException) {
        return ['status' => 400, 'body' => ['ok' => false, 'message' => 'Некорректный формат заявки.']];
    }
    if (!is_array($payload)) {
        return ['status' => 422, 'body' => ['ok' => false, 'message' => 'Проверьте данные заявки и подтвердите согласие.']];
    }
    return cvtDeliverValidatedLead($payload, $emailSender);
}

function cvtRespond(int $status, array $payload, ?int $retryAfter = null): void
{
    http_response_code($status);
    if ($retryAfter !== null) {
        header('Retry-After: ' . $retryAfter);
    }
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if (PHP_SAPI !== 'cli') {
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, max-age=0');
    header('X-Content-Type-Options: nosniff');

    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        header('Allow: POST');
        cvtRespond(405, ['ok' => false, 'message' => 'Метод не поддерживается.']);
    }
    try {
        $rawBody = file_get_contents('php://input', false, null, 0, CVT_MAX_REQUEST_BYTES + 1);
        $result = cvtHandleRequest($_SERVER, is_string($rawBody) ? $rawBody : '', cvtRateLimitDirectory(), 'cvtSendEmail');
    } catch (Throwable) {
        // No exception text, filesystem paths, or request data in the public response.
        $result = ['status' => 503, 'body' => ['ok' => false, 'message' => 'Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.']];
    }
    cvtRespond($result['status'], $result['body'], $result['retry_after'] ?? null);
}
