import { AutomationLoggerInternal, LogEntry, LogLevel } from "./logger";

const __TEMPLATE__: string = require('./html-report.template.html');

export function createHtmlReport(title?: string): string {
    try {
        return __TEMPLATE__
            .replace('$TITLE$', title || 'Test Report')
            .replace('$BODY$', createLogEntryReport(AutomationLoggerInternal.logs));
    } catch (e) {
        return `Error while generating HTML report: ${e.message}\n${e.stack}`;
    }
}

function createLogEntryReport(entry: LogEntry): string {
    if (!entry) return '---------';
    const statusClass = entryLogLevelAsClass(entry);
    const categoryClass = entryCategoryAsClass(entry);
    const clazz = `log-entry ${statusClass} ${categoryClass}`;
    const category = formatCategory(entry);
    const message = formatMessage(entry);
    const entryLine = `${category} ${message}`;
    return !entry.entries?.length && !entry.moreInfo
        ? `<div class="${clazz}">${entryLine}</div>`
        : `<details class="${clazz}${entry.entries.length ? ' operation' : ''}">
    <summary>${entryLine}</summary>
    <div class="details-content">
        ${entry.moreInfo ? formatMoreInfo(entry, statusClass) : ''}
        ${entry.entries.map(createLogEntryReport).join('\n')}
    </div>
</details>\n`;
}

function formatMessage({ message }: LogEntry): string {
    return `<span class="message">${escape(message)}</span>`;
}

function formatMoreInfo({ moreInfo, entries }: LogEntry, statusClass: string): string {
    const content = escape(moreInfo);
    const getInfo = (compact?: boolean) => `<div class="more-info${compact ? ' compact' : ''}">${content}</div>`;
    return entries.length
        ? `<details class="${statusClass}"><summary>More Info...</summary>${getInfo()}</details>`
        : getInfo(true);
}

function formatCategory({ category }: LogEntry): string {
    return `<span class="category">${category}</span>`;
}

function entryLogLevelAsClass({ logLevel }: LogEntry): string {
    return LogLevel[logLevel].toLowerCase();
}

function entryCategoryAsClass({ category, logLevel }: LogEntry): string {
    const c = category.toLowerCase();
    if (['file', 'suite', 'test'].includes(c))
        return `${c}-${logLevel === LogLevel.ERROR ? 'failed' : 'not-failed'}`;
    return `category-${c}`;
}

function escape(text: string): string {
    return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}