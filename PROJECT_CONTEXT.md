# THEA LIU Portfolio Website Context

## Project Summary

This repository contains THEA LIU / Liu Qiheng's selected works portfolio website.

The website is a lightweight static portfolio built with:

- HTML
- CSS
- JavaScript
- GitHub Pages

It is intentionally not a PDF reader, flipbook, slideshow, or thumbnail gallery. The experience is a scroll-based digital portfolio that preserves the editorial rhythm of the original portfolio while making it accessible as a public website.

## Public Website

Live URL:

https://thea0118.github.io/thea-portfolio/

GitHub repository:

https://github.com/thea0118/thea-portfolio

Local GitHub repository:

/Users/frankenstein/Documents/GitHub/thea-portfolio

Original working source folder:

/Users/frankenstein/Documents/Codex/2026-06-08/files-mentioned-by-the-user-pdf

## Design Direction

Overall tone:

- Chinese-first
- Editorial
- Minimal
- Restrained
- Portfolio-as-publication
- Scroll-based digital portfolio

The homepage should feel closer to a portfolio contents/front matter page than a visual wall or agency landing page.

The homepage currently contains:

- Typed navigation signature: Thea LIU
- Large image wordmark
- Chinese name: Liu Qiheng / 刘绮恒
- Category line: 品牌视觉 / 交互体验 / 包装创意 / 影像叙事

Project pages should preserve the original portfolio page layouts as exported images. Do not rewrite them into generic case study templates unless explicitly requested.

## Navigation Structure

Top navigation:

- 首页 / Home
- 关于 / About
- 章节 / Sections
- 联系 / Contact

The left signature `Thea LIU` links to the About section.

There is also a floating project index button:

- 项目目录
- Project Index

The project index opens a full list of projects and jumps directly to project sections.

## Main Files

Core files:

- `index.html`
- `style.css`
- `script.js`
- `PROJECT_CONTEXT.md`

Asset folders:

- `assets/brand`
- `assets/fonts`
- `assets/pages-web`
- `assets/pages-transparent`
- `assets/videos`

Important note:

`assets/pages-web` is the optimized web image folder currently used by the live website.

`assets/pages-hd` was removed from the GitHub Pages deployment because it made the site too heavy.

## Image Strategy

Original project pages were exported at high resolution, but the live website uses optimized images for faster loading.

Current live project image folder:

`assets/pages-web`

Optimization performed:

- Original project images were around 3840 px wide.
- Web images were resized to around 2560 px wide.
- Project image total size was reduced from about 111 MB to about 20 MB.
- Non-critical images use lazy loading.

HTML image loading strategy:

- Homepage wordmark and About image use `fetchpriority="high"`.
- Project images use `loading="lazy"` and `decoding="async"`.

If new images are added later, create web-optimized versions before pushing to GitHub Pages.

## Video Strategy

Current videos:

- `assets/videos/cny.mp4`
- `assets/videos/olay-mothers-day.mp4`

Video behavior:

- Videos appear automatically when their related project area enters view.
- The project image shifts to reveal the vertical video.
- Videos play once.
- Clicking the video replays it.
- Small text below video: 点击再次播放

The videos are small enough to keep in the repository.

## Typography

The portfolio uses embedded local fonts:

- DFLiSongSC24-W5.otf
- HarmonyOS Sans Light / Regular / Medium
- FZLTHProGlobal Light / Regular

Font roles:

- 华康俪宋 Std W5: large Chinese titles / editorial serif tone
- HarmonyOS Sans: English and navigation
- 方正兰亭黑Pro Global: Chinese body and index text

Font files are still relatively large. If performance needs further improvement, the next optimization target is font subsetting.

## Deployment

The site is deployed through GitHub Pages from:

- Branch: `main`
- Folder: `/ (root)`

Publishing flow:

1. Edit files in `/Users/frankenstein/Documents/GitHub/thea-portfolio`.
2. Test locally if needed.
3. Commit changes.
4. Push to `origin/main`.
5. GitHub Pages updates automatically.

Common commands:

```bash
git status
git add .
git commit -m "Update portfolio website"
git push origin main
```

## SSH Setup

A dedicated SSH key was generated for this portfolio repository.

SSH key files:

- Private key: `~/.ssh/thea_portfolio_ed25519`
- Public key: `~/.ssh/thea_portfolio_ed25519.pub`

SSH config alias:

```sshconfig
Host github-thea-portfolio
  HostName github.com
  User git
  IdentityFile ~/.ssh/thea_portfolio_ed25519
  IdentitiesOnly yes
```

Git remote:

```text
git@github-thea-portfolio:thea0118/thea-portfolio.git
```

SSH authentication was tested successfully with GitHub account:

`thea0118`

## Current Performance State

The first deployed version was slow because the site loaded large project images.

Performance improvements already completed:

- Created `assets/pages-web`.
- Switched project images from `pages-hd` to `pages-web`.
- Removed `pages-hd` from deployed repository.
- Added lazy loading to project images.
- Pushed optimized version to GitHub.

If the site still feels slow:

1. Check whether GitHub Pages cache has updated.
2. Consider converting project images to WebP or AVIF.
3. Consider font subsetting.
4. Consider adding responsive `srcset` images.

## Important Working Preferences

When continuing this project:

- Preserve the editorial portfolio feel.
- Do not turn the site into a Behance-style card grid.
- Do not turn the site into a PDF reader.
- Do not create PDF page navigation, flipbook behavior, thumbnails, page numbers, or PPT browsing.
- Keep Chinese as the primary visual language.
- Keep project page layouts close to the original portfolio exports unless the user explicitly asks for redesigned layouts.
- Prioritize visual quality, reading rhythm, and loading performance.

## Known Future Improvements

Potential next steps:

- Fine-tune mobile layout.
- Add custom domain.
- Further compress or subset fonts.
- Add responsive image sets.
- Add project-specific video moments.
- Replace remaining heavy PNGs if needed.
- Improve SEO metadata and social sharing preview.

