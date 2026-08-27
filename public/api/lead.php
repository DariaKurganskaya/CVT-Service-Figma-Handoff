<?php
declare(strict_types=1);

const CVT_MAX_REQUEST_BYTES = 8192;
const CVT_LEAD_EMAIL = 'info@remontvariator.ru';
const CVT_LEAD_SUBJECT = 'Новая заявка с remontvariator.ru';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function cvtRespond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function cvtTextLength(string $value): int
{
    if (function_exists('mb_strlen')) {
        return mb_strlen($value, 'UTF-8');
    }

    $characters = [];
    $count = preg_match_all('/./u', $value, $characters);

    return $count === false ? -1 : $count;
}

function cvtReadString(array $payload, string $key): ?string
{
    if (!array_key_exists($key, $payload) || !is_string($payload[$key])) {
        return null;
    }

    $value = trim($payload[$key]);

    return strpos($value, "\r") !== false || strpos($value, "\n") !== false || strpos($value, "\0") !== false ? null : $value;
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

function cvtPrivateTelegramConfig(): array
{
    $documentRoot = $_SERVER['DOCUMENT_ROOT'] ?? '';
    if (!is_string($documentRoot) || $documentRoot === '') {
        return [];
    }

    $configPath = dirname($documentRoot) . '/private/cvt-leads.php';
    if (!is_file($configPath)) {
        return [];
    }

    $config = @include $configPath;

    return is_array($config) ? $config : [];
}

function cvtSendTelegram(array $config, string $message): bool
{
    $token = $config['telegram_bot_token'] ?? null;
    $chatId = $config['telegram_chat_id'] ?? null;
    if (!is_string($token) || !is_string($chatId) || !preg_match('/^\d+:[A-Za-z0-9_-]+$/', $token) || $chatId === '') {
        return false;
    }

    $payload = json_encode([
        'chat_id' => $chatId,
        'text' => $message,
        'disable_web_page_preview' => true,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    if (!is_string($payload)) {
        return false;
    }

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\nAccept: application/json\r\n",
            'content' => $payload,
            'timeout' => 5,
            'ignore_errors' => true,
        ],
    ]);

    $response = @file_get_contents('https://api.telegram.org/bot' . $token . '/sendMessage', false, $context);
    $decoded = is_string($response) ? json_decode($response, true) : null;

    return is_array($decoded) && ($decoded['ok'] ?? false) === true;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    cvtRespond(405, ['ok' => false, 'message' => 'Метод не поддерживается.']);
}

$contentLength = $_SERVER['CONTENT_LENGTH'] ?? null;
if (is_string($contentLength) && ctype_digit($contentLength) && (int) $contentLength > CVT_MAX_REQUEST_BYTES) {
    cvtRespond(413, ['ok' => false, 'message' => 'Слишком большой запрос.']);
}

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (!is_string($contentType) || stripos($contentType, 'application/json') !== 0) {
    cvtRespond(400, ['ok' => false, 'message' => 'Некорректный формат заявки.']);
}

$rawBody = file_get_contents('php://input');
if (!is_string($rawBody) || strlen($rawBody) === 0 || strlen($rawBody) > CVT_MAX_REQUEST_BYTES) {
    cvtRespond(400, ['ok' => false, 'message' => 'Некорректный формат заявки.']);
}

try {
    $payload = json_decode($rawBody, true, 32, JSON_THROW_ON_ERROR);
} catch (JsonException) {
    cvtRespond(400, ['ok' => false, 'message' => 'Некорректный формат заявки.']);
}

if (!is_array($payload) || cvtIsList($payload)) {
    cvtRespond(422, ['ok' => false, 'message' => 'Проверьте данные заявки.']);
}

$name = cvtReadString($payload, 'name');
$phone = cvtReadString($payload, 'phone');
$message = cvtReadString($payload, 'message');
$source = cvtReadString($payload, 'source');
$consent = $payload['consent'] ?? null;
$phoneDigits = is_string($phone) ? preg_replace('/\D/u', '', $phone) : null;

if (
    $name === null || cvtTextLength($name) < 2 || cvtTextLength($name) > 80 ||
    $phone === null || !is_string($phoneDigits) || strlen($phoneDigits) < 7 || strlen($phoneDigits) > 20 ||
    $message === null || cvtTextLength($message) > 1000 ||
    !in_array($source, ['hero', 'contact'], true) ||
    $consent !== true
) {
    cvtRespond(422, ['ok' => false, 'message' => 'Проверьте данные заявки и подтвердите согласие.']);
}

$serverTime = date('c');
$sourceLabels = [
    'hero' => 'Форма первого экрана',
    'contact' => 'Форма контактов',
];
$leadMessage = implode("\n", [
    'Новая заявка с remontvariator.ru',
    '',
    'Имя: ' . $name,
    'Телефон: ' . $phone,
    'Сообщение: ' . ($message === '' ? 'Не указано' : $message),
    'Источник: ' . $sourceLabels[$source],
    'Время сервера: ' . $serverTime,
]);

$emailSent = @mail(
    CVT_LEAD_EMAIL,
    CVT_LEAD_SUBJECT,
    $leadMessage,
    implode("\r\n", [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'From: CVT Сервис <' . CVT_LEAD_EMAIL . '>',
        'Reply-To: ' . CVT_LEAD_EMAIL,
    ])
);

$telegramSent = cvtSendTelegram(cvtPrivateTelegramConfig(), $leadMessage);

if (!$emailSent && !$telegramSent) {
    cvtRespond(500, ['ok' => false, 'message' => 'Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.']);
}

cvtRespond(200, ['ok' => true, 'message' => 'Заявка отправлена. Мы свяжемся с вами в ближайшее время.']);
