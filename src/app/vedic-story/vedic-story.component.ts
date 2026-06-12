import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml, Meta, Title } from '@angular/platform-browser';
import { HoroscopeService } from '../horoscope.service';

const CDN_HTML_BASE = 'https://cdn.theboldlens.com/html';

@Component({
  selector: 'app-vedic-story',
  templateUrl: './vedic-story.component.html',
  styleUrls: ['./vedic-story.component.scss']
})
export class VedicStoryComponent implements OnInit {

  showLD = true;
  notFound = false;
  slug = '';
  storyTitle = '';
  byline = '';
  content: SafeHtml;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private horoService: HoroscopeService,
    private meta: Meta,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    if (!this.slug) {
      this.notFound = true;
      this.showLD = false;
      return;
    }

    const navState = this.router.getCurrentNavigation()?.extras?.state || history.state;
    if (navState?.title) {
      this.setMeta(navState.title, navState.byline);
    } else {
      // Direct link / refresh — look up title & byline from the published slugs list
      this.horoService.getVedicStories().subscribe((res: any) => {
        const match = (res?.articles || []).find((a: any) => a.slug === this.slug);
        if (match) {
          this.setMeta(match.title, match.byline);
        }
      }, () => { /* meta is best-effort; article content still renders */ });
    }

    this.http.get(`${CDN_HTML_BASE}/${this.slug}.html`, { responseType: 'text' }).subscribe(html => {
      this.content = this.sanitizer.bypassSecurityTrustHtml(html);
      this.showLD = false;
    }, () => {
      this.notFound = true;
      this.showLD = false;
    });
  }

  private setMeta(title: string, byline?: string) {
    this.storyTitle = title || '';
    this.byline = byline || '';
    if (title) {
      this.titleService.setTitle(`${title} — VedicHoroo`);
      this.meta.updateTag({ name: 'description', content: title });
      this.meta.updateTag({ property: 'og:title', content: title });
    }
  }
}
