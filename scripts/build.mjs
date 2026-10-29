import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const output = resolve('dist');
const files = ['index.html', 'styles.css', 'app.js'];
const sources = await Promise.all(files.map(file => readFile(file, 'utf8')));
// Assets referenced explicitly by the HTML, CSS and content catalog only.
const assets = new Set(sources.flatMap(source => [...source.matchAll(/[\w-]+\.(?:png|jpg|jpeg|webp|svg)\b/g)].map(match => match[0])));
// Validate every input before replacing the previous build.
for (const asset of assets) await readFile(resolve('assets', asset));
await rm(output, { recursive: true, force: true });
await mkdir(resolve(output, 'assets'), { recursive: true });
for (const file of files) await cp(file, resolve(output, file));
for (const asset of assets) await cp(resolve('assets', asset), resolve(output, 'assets', asset));
await writeFile(resolve(output, '404.html'), '<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>페이지를 찾을 수 없습니다</title><body><h1>페이지를 찾을 수 없습니다.</h1><a href="/">홈으로 돌아가기</a></body></html>');
console.log(`Static site built in dist/ (${assets.size} validated assets)`);
