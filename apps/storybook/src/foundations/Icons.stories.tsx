import * as Icons from '@dextinity/icons';
import { iconsMeta } from '@dextinity/icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ComponentType } from 'react';
import { Code, Page, Section } from './ui';
import { figmaDesign } from '../figma';

const registry = Icons as unknown as Record<string, ComponentType<Icons.IconProps>>;

function IconGallery() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const list = iconsMeta.filter(
    (i) =>
      !q ||
      i.name.toLowerCase().includes(q) ||
      i.figma.toLowerCase().includes(q) ||
      i.keywords.some((k) => k.toLowerCase().includes(q)),
  );
  return (
    <Page
      title="Icons"
      intro={
        <>
          Aus der Figma-Page „Iconography“. Farbe folgt der Textfarbe (<Code>currentColor</Code>),
          Größe per <Code>size</Code> (Default 16). Ohne <Code>title</Code> sind Icons dekorativ (
          <Code>aria-hidden</Code>).
        </>
      }
    >
      <label className="block max-w-sm space-y-1">
        <span className="typo-label-sm">Suchen</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="z.B. close, check, loupe"
          className="block h-10 w-full rounded-forms border border-border-field bg-background px-3 typo-body-md-normal placeholder:text-foreground-placeholder hover:border-border-strong"
        />
      </label>
      <Section title={`${list.length} von ${iconsMeta.length} Icons`}>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-3">
          {list.map((i) => {
            const Cmp = registry[i.name];
            return (
              <li
                key={i.name}
                className="space-y-3 rounded-surface border border-border-subtle p-3"
                title={i.figma}
              >
                <div className="flex items-center gap-3 text-foreground">
                  {Cmp ? <Cmp size={16} /> : null}
                  {Cmp ? <Cmp size={24} /> : null}
                </div>
                <div className="typo-label-xs break-all">{i.name}</div>
                <div className="typo-body-xs-normal break-all text-foreground-muted">
                  {i.keywords.join(' · ')}
                </div>
              </li>
            );
          })}
        </ul>
      </Section>
    </Page>
  );
}

const storyMeta = {
  title: 'Foundations/Icons',
  parameters: { layout: 'fullscreen', design: figmaDesign('128:28') },
  tags: ['!autodocs'],
} satisfies Meta;
export default storyMeta;

export const Gallery: StoryObj<typeof storyMeta> = { render: () => <IconGallery /> };
