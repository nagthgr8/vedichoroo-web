import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-vedic-yogas',
  templateUrl: './vedic-yogas.component.html',
  styleUrls: ['./vedic-yogas.component.scss']
})
export class VedicYogasComponent implements OnInit {

  categories = [
    {
      name: 'Sun-Based Yogas',
      icon: '☀',
      yogas: [
        { num: 1,  name: 'Ubhayachari',     desc: 'Planets in 2nd & 12th from Sun' },
        { num: 2,  name: 'Veshi',           desc: 'Planets in 2nd house from Sun' },
        { num: 3,  name: 'Voshi',           desc: 'Planets in 12th house from Sun' },
      ]
    },
    {
      name: 'Pancha Mahapurusha',
      icon: '★',
      yogas: [
        { num: 4,  name: 'Ruchaka',         desc: 'Mars exalted / own sign in Kendra' },
        { num: 5,  name: 'Bhadra',          desc: 'Mercury exalted / own sign in Kendra' },
        { num: 6,  name: 'Hamsa',           desc: 'Jupiter exalted / own sign in Kendra' },
        { num: 7,  name: 'Malavya',         desc: 'Venus exalted / own sign in Kendra' },
        { num: 8,  name: 'Shasha',          desc: 'Saturn exalted / own sign in Kendra' },
      ]
    },
    {
      name: 'Moon-Based Yogas',
      icon: '☽',
      yogas: [
        { num: 9,  name: 'Gajkesari',       desc: 'Moon & Jupiter in mutual Kendra' },
        { num: 10, name: 'Gajkesari (II)',   desc: 'Jupiter aspect variant' },
        { num: 11, name: 'Adhi',            desc: 'Mercury / Jupiter / Venus in 6–7–8 from Moon' },
        { num: 12, name: 'Sunapha',         desc: 'Planets in 2nd from Moon only' },
        { num: 13, name: 'Anapha',          desc: 'Planets in 12th from Moon only' },
        { num: 14, name: 'Durudhara',       desc: 'Planets in both 2nd & 12th from Moon' },
        { num: 15, name: 'Kemadruma I',     desc: 'No benefics adjacent to Moon (core)' },
        { num: 16, name: 'Kemadruma II',    desc: 'Jupiter cancellation variant' },
        { num: 17, name: 'Kemadruma III',   desc: 'Inimical planet variant' },
        { num: 18, name: 'Kemadruma IV',    desc: 'Rahu-Ketu axis variant' },
        { num: 19, name: 'Vasumana',        desc: 'Benefics in Upachaya houses from Moon' },
        { num: 20, name: 'Vasumana (Full)', desc: 'All 3 benefics in Upachaya houses' },
        { num: 21, name: 'Uttamadi',        desc: 'Moon in Apoklima houses from Sun' },
        { num: 22, name: 'Shakata I',       desc: 'Jupiter in 6th / 8th / 12th from Moon' },
        { num: 23, name: 'Shakata II',      desc: 'All planets in 1st & 7th houses only' },
        { num: 24, name: 'Pakshi',          desc: 'All planets in 4th & 10th houses only' },
      ]
    },
    {
      name: 'Sankhya Yogas',
      icon: '⬡',
      yogas: [
        { num: 25, name: 'Veena',           desc: '7 zodiac signs occupied by planets' },
        { num: 26, name: 'Daama',           desc: '6 zodiac signs occupied by planets' },
        { num: 27, name: 'Paasha',          desc: '5 zodiac signs occupied by planets' },
        { num: 28, name: 'Kedhara',         desc: '4 zodiac signs occupied by planets' },
        { num: 29, name: 'Shoola',          desc: '3 zodiac signs occupied by planets' },
        { num: 30, name: 'Yuga',            desc: '2 zodiac signs occupied by planets' },
        { num: 31, name: 'Gola',            desc: '1 zodiac sign occupied by planets' },
      ]
    },
    {
      name: 'Aashraya Yogas',
      icon: '⟁',
      yogas: [
        { num: 32, name: 'Rajju',           desc: 'All planets in male (odd) signs' },
        { num: 33, name: 'Musala',          desc: 'All planets in female (even) signs' },
        { num: 34, name: 'Nala',            desc: 'All planets in dual (mutable) signs' },
      ]
    },
    {
      name: 'Dala Yogas',
      icon: '❋',
      yogas: [
        { num: 35, name: 'Maala',           desc: 'Benefics in Kendra — no malefics present' },
        { num: 36, name: 'Sarpa',           desc: 'Malefics in Kendra — no benefics present' },
      ]
    },
    {
      name: 'Akriti (Shape) Yogas',
      icon: '◈',
      yogas: [
        { num: 37, name: 'Gada',            desc: 'All planets in pairs of adjacent Kendra houses' },
        { num: 38, name: 'Shringataka',     desc: 'All planets concentrated in Trikona houses' },
        { num: 39, name: 'Hala',            desc: 'Planets spread across Trikona groupings' },
        { num: 40, name: 'Kamala',          desc: 'All four Kendra houses occupied' },
      ]
    },
    {
      name: 'Raja & Dhana Yogas',
      icon: '♛',
      yogas: [
        { num: 41, name: 'Maha Yoga I',     desc: 'Lagna lord Parivartana (house exchange)' },
        { num: 42, name: 'Maha Yoga II',    desc: '2nd lord exchange with auspicious house lord' },
        { num: 43, name: 'Maha Yoga IV',    desc: '4th lord exchange with auspicious house lord' },
        { num: 44, name: 'Maha Yoga V',     desc: '5th lord exchange with auspicious house lord' },
        { num: 45, name: 'Maha Yoga VII',   desc: '7th lord exchange with auspicious house lord' },
        { num: 46, name: 'Maha Yoga IX',    desc: '9th lord exchange with auspicious house lord' },
        { num: 47, name: 'Maha Yoga X',     desc: '10th lord exchange with 11th house lord' },
        { num: 48, name: 'Khadga',          desc: '2nd & 9th lords in Kendra / Trikona exchange' },
        { num: 49, name: 'Lagnadhi',        desc: 'Benefics in 7th & 8th from Lagna, no malefic aspects' },
        { num: 50, name: 'Parvata I',       desc: 'Benefics in Kendra, no malefics in 6th / 8th' },
        { num: 51, name: 'Parvata II',      desc: 'Lagna & 12th lords in Kendra with benefic aspect' },
        { num: 52, name: 'Lakshmi',         desc: 'Lagna lord & 9th lord both strong in Kendra' },
      ]
    },
    {
      name: 'Combination Yogas',
      icon: '⚯',
      yogas: [
        { num: 53, name: 'Vajra I',         desc: 'Benefics in 1st/7th, malefics in 4th/10th' },
        { num: 54, name: 'Vajra II',        desc: 'Malefics in 1st/7th, benefics in 4th/10th' },
        { num: 55, name: 'Kaahala I',       desc: '4th & 9th lords in Kendra with strong Lagna lord' },
        { num: 56, name: 'Kaahala II',      desc: '4th lord exalted with 10th lord aspect' },
        { num: 57, name: 'Shankha I',       desc: '5th & 6th lords in Kendra with strong Lagna lord' },
        { num: 58, name: 'Shankha II',      desc: 'Lagna & 10th lords in movable signs' },
        { num: 59, name: 'Bheri I',         desc: 'Lagna + Jupiter + Venus in Kendra, strong 9th lord' },
        { num: 60, name: 'Bheri II',        desc: 'Strong 9th lord variant of Bheri formation' },
      ]
    }
  ];

  playStoreUrl = 'https://play.google.com/store/apps/details?id=com.vedichoroo.astrology';

  constructor(private meta: Meta, private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('60 Vedic Yogas Analyzed — VedicHoroo Astrology App');
    this.meta.updateTag({ name: 'description', content: 'VedicHoroo analyzes 60 classical Vedic yoga conditions in your birth chart — including Pancha Mahapurusha, Gajkesari, Raja Yogas, Maha Yogas and more. Based on Yogas in Astrology by K.S. Charak.' });
    this.meta.updateTag({ name: 'keywords', content: 'vedic yogas, astrology yogas, pancha mahapurusha yoga, gajkesari yoga, raja yoga, maha yoga, kemadruma yoga, birth chart yogas, kundali yogas, free horoscope yoga analysis' });
    this.meta.updateTag({ property: 'og:title', content: '60 Vedic Yogas Analyzed — VedicHoroo' });
    this.meta.updateTag({ property: 'og:description', content: 'Discover which of 60 classical Vedic yogas are active in your birth chart. Free, instant analysis powered by K.S. Charak\'s Yogas in Astrology.' });
    this.meta.updateTag({ property: 'og:url', content: 'https://vedichoroo.com/vedic-yogas' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: '60 Vedic Yogas Analyzed — VedicHoroo' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Discover which of 60 classical Vedic yogas are present in your horoscope. Free analysis on VedicHoroo.' });
  }
}
