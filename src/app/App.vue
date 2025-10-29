<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Languages } from 'lucide-vue-next'
import { provideRepositories } from './providers'

provideRepositories()
</script>

<template>
  <div class="min-h-screen bg-base-200 text-base-content">
    <header class="border-b border-base-300 bg-base-100">
      <div class="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Languages class="h-5 w-5" />
          </span>
          <div>
            <p class="text-lg font-semibold">Cram</p>
            <p class="text-sm text-base-content/60">Outcome-focused language drills.</p>
          </div>
        </div>
        <div class="flex items-center gap-2 text-sm text-base-content/70">
          <span class="badge badge-outline">Prototype</span>
        </div>
      </div>
    </header>

    <main class="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:px-6">
      <RouterView />
    </main>
  </div>
</template>
