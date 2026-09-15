// Components available inside case study MDX files without importing them.
// Passed to <Content components={caseStudyComponents} /> on the case study pages.
import Figure from './Figure.astro';
import Insight from './Insight.astro';
import Insights from './Insights.astro';
import Learnings from './Learnings.astro';
import Option from './Option.astro';
import Options from './Options.astro';
import Phone from './Phone.astro';
import Quote from './Quote.astro';
import Section from './Section.astro';
import Stat from './Stat.astro';
import Stats from './Stats.astro';
import Takeaway from './Takeaway.astro';

export const caseStudyComponents = {
  Figure,
  Insight,
  Insights,
  Learnings,
  Option,
  Options,
  Phone,
  Quote,
  Section,
  Stat,
  Stats,
  Takeaway,
};
