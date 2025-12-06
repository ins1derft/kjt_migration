import type { FormConfig } from '@/lib/api';
import type { InteractiveShowcaseProps } from '@/components/blocks/InteractiveShowcase';

export const buildInteractiveFloorShowcasePreset = (
  formConfig?: FormConfig | null,
): InteractiveShowcaseProps => ({
  defaultFormCode: formConfig?.code ?? null,
  formConfig: formConfig ?? null,
  items: [
    {
      title: 'Interactive AR Sandbox',
      description:
        'The interactive AR sandbox in hospitals combines entertainment, education, and rehabilitation. Children shape landscapes and bring them to life with dynamic elements. This tool reduces stress, enhances motor skills through creative physical play, and educates the children on geography and ecology. It makes the hospital stay a less emotionally traumatic experience, and a more positive and productive one.',
      hashtag: '# A game that encourages exploration',
      features: [
        { icon: '/icons/interactive-header/eq_icon_gamepad.svg', label: '22+ games' },
        { icon: '/icons/interactive-header/dimensions.svg', label: "Dimensions: 8' x 4,5' (ft)" },
        { icon: '/icons/interactive-header/eq_icon_projector.svg', label: 'Kinect sensor + Projector' },
      ],
      ctaLabel: 'Order an interactive Sandbox',
      ctaHref: '/interactive-sandbox',
      videoId: 'QNT7l1TT7_0',
      videoPoster: '/images/interactive-header/hero-desktop.jpg',
      gallery: [
        { src: '/images/interactive-header/hero-desktop.jpg', alt: 'Interactive AR Sandbox still' },
      ],
    },
    {
      title: 'Interactive Floors + Interactive Mobile Floor',
      description:
        'Interactive floors help children cope with the stress that can come with treatment. Fascinating visual effects on the floor create a sense of playfulness, encouraging children to move. This fosters motor skill development while providing a distraction to reduce stress and anxiety. These activities create a positive environment that encourages learning, socialization, and mental well-being.',
      hashtag: '# A fun, full-body active game',
      features: [
        { icon: '/icons/interactive-header/eq_icon_gamepad.svg', label: '120+ games' },
        { icon: '/icons/interactive-header/dimensions.svg', label: "Size: 15' x 7' (ft)" },
        { icon: '/icons/interactive-header/eq_icon_projector.svg', label: 'White FOAM mat, LiDar motion sensor' },
      ],
      ctaLabel: 'Order an Interactive Floor',
      ctaHref: '/interactive-floor',
      videoId: 'TJIISnmlERc',
      videoPoster: '/images/interactive-header/hero-desktop.jpg',
      gallery: [
        { src: '/images/interactive-header/hero-desktop.jpg', alt: 'Interactive floor still' },
      ],
    },
  ],
});

export default buildInteractiveFloorShowcasePreset;
