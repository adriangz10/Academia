import type { StorybookConfig } from '@storybook/angular';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [],
  framework: {
    name: dirname(fileURLToPath(import.meta.resolve('@storybook/angular/package.json'))),
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;