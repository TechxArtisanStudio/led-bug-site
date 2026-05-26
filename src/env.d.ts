/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    i18n?: import('./lib/locale-context').LocaleContext;
  }
}
