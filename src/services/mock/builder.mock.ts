import type { ApiBuilderTree, ApiPhase, ApiPhaseIconType, ApiTask, ApiSubtask } from '@/types/api';
import { readMockStore, writeMockStore } from './store';
import { getVersionFromMock } from './versions.mock';

const BUILDER_KEY_PREFIX = 'builder';

function builderKey(versionId: string): string {
  return `${BUILDER_KEY_PREFIX}:${versionId}`;
}

// ─── helpers ────────────────────────────────────────────────────────────────

function subtask(id: string, taskId: string, label: string, idx: number): ApiSubtask {
  return {
    id,
    taskId,
    definitionId: null,
    label,
    done: idx % 3 === 0,
    estimatedMinutes: [15, 30, 45, 60][idx % 4],
    orderIndex: idx,
    metadata: null,
  };
}

const CHANNELS = ['email', 'sms', 'push', 'in-app', 'social', 'display'];
const SENDERS = ['u-1', 'u-2', 'u-3'];
const AUDIENCES = ['audience-1', 'audience-2', 'audience-all', 'audience-vip', 'audience-new'];

function task(
  id: string,
  actionId: string,
  name: string,
  idx: number,
  subtaskLabels: string[],
): ApiTask {
  const channel = CHANNELS[idx % CHANNELS.length];
  return {
    id,
    actionId,
    name,
    channelId: channel,
    compositionId: null,
    message: `${name} — campaign message copy for ${channel} channel.`,
    senderId: SENDERS[idx % SENDERS.length],
    receiverId: AUDIENCES[idx % AUDIENCES.length],
    orderIndex: idx,
    date: { mode: 'linked', weekOffset: Math.floor(idx / 2), dayOffset: idx % 5 },
    specsState: idx % 4 === 0 ? { status: 'empty' } : { status: 'filled', value: `${channel} spec v${idx + 1}` },
    missingDataState: idx % 5 === 0 ? { status: 'empty' } : { status: 'not-needed' },
    subtasks: subtaskLabels.map((label, si) =>
      subtask(`${id}-sub-${si + 1}`, id, label, si),
    ),
    isSmall: null,
    updatedAt: null,
    updatedBy: null,
    metadata: null,
    generationContext: null,
  };
}

// ─── phase definitions ───────────────────────────────────────────────────────

interface PhaseDef {
  label: string;
  icon: ApiPhaseIconType;
  actions: { name: string; description: string; tasks: { name: string; subtasks: string[] }[] }[];
}

const PHASE_DEFS: PhaseDef[] = [
  {
    label: 'Awareness',
    icon: 'awareness',
    actions: [
      {
        name: 'Launch email stream',
        description: 'Initial launch email communications to the full audience.',
        tasks: [
          { name: 'Announcement email', subtasks: ['Write subject line', 'Design header', 'Write body copy', 'Add CTA button', 'QA on mobile'] },
          { name: 'Welcome sequence email 1', subtasks: ['Define journey trigger', 'Write copy', 'Build template', 'Set send time', 'Approval sign-off'] },
          { name: 'Welcome sequence email 2', subtasks: ['Write follow-up copy', 'Personalize tokens', 'A/B subject test', 'Render test', 'Schedule send'] },
          { name: 'Brand awareness blast', subtasks: ['Segment audience', 'Design creative', 'Write headline', 'Legal review', 'Deploy'] },
          { name: 'Re-engagement nudge', subtasks: ['Define dormant segment', 'Write subject', 'Build email', 'Test deliverability', 'Send'] },
        ],
      },
      {
        name: 'Social media teaser',
        description: 'Pre-launch organic social posts to build anticipation.',
        tasks: [
          { name: 'Instagram teaser post', subtasks: ['Create graphic', 'Write caption', 'Add hashtags', 'Schedule post', 'Monitor engagement'] },
          { name: 'Twitter/X thread', subtasks: ['Draft thread', 'Design media', 'Review tone', 'Schedule', 'Track impressions'] },
          { name: 'LinkedIn article', subtasks: ['Outline article', 'Write draft', 'Add visuals', 'Publish', 'Amplify via team'] },
          { name: 'Facebook story', subtasks: ['Create story frames', 'Add poll sticker', 'Write swipe-up CTA', 'Publish', 'Respond to DMs'] },
          { name: 'YouTube community post', subtasks: ['Write post copy', 'Attach image', 'Set visibility', 'Pin comment', 'Track reach'] },
          { name: 'TikTok countdown', subtasks: ['Script concept', 'Film video', 'Edit', 'Add captions', 'Post and engage'] },
        ],
      },
      {
        name: 'Paid awareness push',
        description: 'Top-of-funnel paid ads to expand reach.',
        tasks: [
          { name: 'Google display campaign', subtasks: ['Define audience', 'Build creatives', 'Set bid strategy', 'Launch', 'Optimize CTR'] },
          { name: 'Meta prospecting ads', subtasks: ['Create lookalike audience', 'Design carousel', 'Write ad copy', 'Set budget', 'Monitor ROAS'] },
          { name: 'YouTube pre-roll', subtasks: ['Script 15s video', 'Produce video', 'Upload to Google Ads', 'Target interest segments', 'Measure view rate'] },
          { name: 'LinkedIn sponsored content', subtasks: ['Write post', 'Design image', 'Define B2B targeting', 'Set daily budget', 'Review leads'] },
          { name: 'Programmatic display', subtasks: ['Brief DSP', 'Upload banners', 'Set frequency cap', 'Launch', 'Brand safety check'] },
        ],
      },
      {
        name: 'Influencer seeding',
        description: 'Send product/briefing to key content creators.',
        tasks: [
          { name: 'Identify micro-influencers', subtasks: ['Research profiles', 'Check engagement rate', 'Vet brand alignment', 'Build contact list', 'Send outreach'] },
          { name: 'Send briefing kits', subtasks: ['Write brief doc', 'Package product', 'Arrange logistics', 'Confirm receipt', 'Follow up'] },
          { name: 'Review content drafts', subtasks: ['Request drafts', 'Check brand guidelines', 'Provide feedback', 'Approve', 'Publish'] },
          { name: 'Track earned media', subtasks: ['Set up monitoring', 'Tag posts', 'Measure impressions', 'Compile report', 'Share learnings'] },
          { name: 'Negotiate amplification', subtasks: ['Identify top performer', 'Agree on boost budget', 'Launch paid amplification', 'Track CPE', 'Report ROI'] },
          { name: 'Collect UGC', subtasks: ['Define UGC hashtag', 'Monitor submissions', 'Curate best content', 'Get usage rights', 'Repurpose in ads'] },
        ],
      },
      {
        name: 'PR outreach',
        description: 'Media pitches and press coverage to drive organic awareness.',
        tasks: [
          { name: 'Write press release', subtasks: ['Draft headline', 'Write body', 'Add quotes', 'Legal review', 'Distribute via wire'] },
          { name: 'Pitch journalists', subtasks: ['Build media list', 'Personalise pitches', 'Send outreach', 'Follow up', 'Track responses'] },
          { name: 'Prepare media kit', subtasks: ['Compile brand assets', 'Write fact sheet', 'Add product photos', 'Package PDF', 'Send to journalists'] },
          { name: 'Embargo coordination', subtasks: ['Set embargo date', 'Send embargo notice', 'Confirm acceptance', 'Lift embargo', 'Monitor coverage'] },
          { name: 'Podcast placements', subtasks: ['Identify shows', 'Send pitch', 'Record episode', 'Provide assets', 'Track downloads'] },
        ],
      },
      {
        name: 'SEO & content seeding',
        description: 'Organic search content to capture demand.',
        tasks: [
          { name: 'Publish hero blog post', subtasks: ['Keyword research', 'Write draft', 'Add internal links', 'SEO meta', 'Publish and index'] },
          { name: 'Guest posts on partner sites', subtasks: ['Identify sites', 'Pitch editors', 'Write article', 'Review and edit', 'Publish with backlink'] },
          { name: 'FAQ landing page', subtasks: ['Research questions', 'Write answers', 'Design layout', 'Add schema markup', 'Submit to Google'] },
          { name: 'Video SEO upload', subtasks: ['Optimise title and description', 'Add chapters', 'Custom thumbnail', 'Add end screens', 'Submit sitemap'] },
          { name: 'Backlink outreach', subtasks: ['Identify prospects', 'Send email', 'Follow up', 'Confirm placement', 'Track DR improvement'] },
          { name: 'Content refresh cycle', subtasks: ['Audit old posts', 'Update statistics', 'Add new sections', 'Re-publish with date', 'Promote on social'] },
        ],
      },
    ],
  },
  {
    label: 'Consideration',
    icon: 'teaser',
    actions: [
      {
        name: 'Nurture email sequence',
        description: 'Multi-touch email nurture for warm leads.',
        tasks: [
          { name: 'Educational email 1', subtasks: ['Choose topic', 'Write copy', 'Design layout', 'Test links', 'Schedule'] },
          { name: 'Case study email', subtasks: ['Select case study', 'Write narrative', 'Add stats', 'Design template', 'Send'] },
          { name: 'Product demo invite', subtasks: ['Write invite copy', 'Add calendar link', 'Set up reminder', 'Track RSVPs', 'Confirm attendance'] },
          { name: 'Objection handler email', subtasks: ['Identify top objections', 'Write responses', 'Add social proof', 'Design email', 'Send to hesitant segment'] },
          { name: 'Competitor comparison email', subtasks: ['Build comparison table', 'Write copy', 'Legal check', 'Design', 'A/B test'] },
          { name: 'Testimonial spotlight', subtasks: ['Source testimonial', 'Get permission', 'Write intro', 'Design layout', 'Deploy'] },
        ],
      },
      {
        name: 'Retargeting ads',
        description: 'Re-engage website visitors who did not convert.',
        tasks: [
          { name: 'Pixel setup and validation', subtasks: ['Install pixel', 'Verify events', 'Test in Meta Events Manager', 'Set up custom audiences', 'QA conversions'] },
          { name: 'Dynamic product retargeting', subtasks: ['Upload product catalog', 'Build DPA template', 'Define audience', 'Set bid', 'Launch'] },
          { name: 'Cart abandonment ads', subtasks: ['Create cart abandonment audience', 'Write urgency copy', 'Design ad', 'Set frequency cap', 'Monitor CVR'] },
          { name: 'Cross-sell retargeting', subtasks: ['Identify purchasers', 'Select cross-sell products', 'Write copy', 'Design creative', 'Launch'] },
          { name: 'Sequential video retargeting', subtasks: ['Plan 3-video sequence', 'Produce videos', 'Set up sequential delivery', 'Monitor completion rate', 'Optimize'] },
        ],
      },
      {
        name: 'Webinar / live event',
        description: 'Host a live educational session to deepen engagement.',
        tasks: [
          { name: 'Event page creation', subtasks: ['Write event description', 'Design registration page', 'Set up registration form', 'Add social share', 'Test flow'] },
          { name: 'Promotional emails', subtasks: ['Write invite', 'Write reminder (24h)', 'Write reminder (1h)', 'Design templates', 'Schedule sends'] },
          { name: 'Presenter preparation', subtasks: ['Confirm presenters', 'Share run of show', 'Rehearsal session', 'Prepare slides', 'Tech check'] },
          { name: 'Live session execution', subtasks: ['Start stream', 'Manage Q&A', 'Monitor chat', 'Record session', 'Wrap up CTA'] },
          { name: 'Post-event follow-up', subtasks: ['Send recording', 'Follow-up email to no-shows', 'Share resource links', 'Survey attendees', 'Identify hot leads'] },
          { name: 'On-demand content packaging', subtasks: ['Edit recording', 'Upload to hub', 'Create transcript', 'SEO optimize', 'Promote via email and social'] },
        ],
      },
      {
        name: 'Comparison & reviews',
        description: 'Encourage third-party reviews and publish comparison content.',
        tasks: [
          { name: 'Review request campaign', subtasks: ['Segment happy customers', 'Write review request email', 'Add G2/Capterra links', 'Set follow-up', 'Track submissions'] },
          { name: 'Review page optimization', subtasks: ['Audit existing reviews', 'Respond to negative reviews', 'Highlight positive ones', 'Add review widget to site', 'Monitor weekly'] },
          { name: 'Comparison blog post', subtasks: ['Define competitors', 'Research features', 'Write post', 'Design tables', 'Publish and promote'] },
          { name: 'G2 profile management', subtasks: ['Update profile info', 'Upload assets', 'Request badges', 'Monitor new reviews', 'Engage reviewers'] },
          { name: 'Trust badges on landing page', subtasks: ['Collect badge assets', 'Design placement', 'Implement on page', 'A/B test impact', 'Report uplift'] },
        ],
      },
      {
        name: 'Free trial / freemium push',
        description: 'Drive free trial sign-ups and in-trial activation.',
        tasks: [
          { name: 'Trial landing page', subtasks: ['Write headline and CTA', 'List key features', 'Add social proof', 'Implement form', 'Launch and track'] },
          { name: 'Trial onboarding email 1', subtasks: ['Write welcome message', 'Add quick-start guide', 'Design email', 'Set trigger', 'QA'] },
          { name: 'In-trial engagement push', subtasks: ['Identify drop-off point', 'Write push notification', 'A/B test copy', 'Measure activation rate', 'Iterate'] },
          { name: 'Trial expiry reminder', subtasks: ['Write urgency email', 'Add upgrade CTA', 'Set expiry trigger', 'Design layout', 'Monitor conversions'] },
          { name: 'Feature spotlight emails', subtasks: ['Choose underused feature', 'Write educational copy', 'Add GIF/video', 'Send to trial users', 'Track feature adoption'] },
          { name: 'Sales outreach to power users', subtasks: ['Identify high-usage trial accounts', 'Personalise outreach', 'Schedule demo', 'Send follow-up', 'Close deal'] },
        ],
      },
    ],
  },
  {
    label: 'Intent',
    icon: 'teaser',
    actions: [
      {
        name: 'High-intent email triggers',
        description: 'Automated sends to users showing strong purchase signals.',
        tasks: [
          { name: 'Pricing page visitor email', subtasks: ['Set up trigger', 'Write copy', 'Add personalisation', 'Design email', 'QA trigger logic'] },
          { name: 'Demo request follow-up', subtasks: ['Write confirmation email', 'Assign to sales', 'Set reminder task', 'Track response rate', 'Report conversions'] },
          { name: 'Abandoned quote email', subtasks: ['Define quote abandonment', 'Write urgency email', 'Add dynamic quote value', 'Set delay', 'Monitor CVR'] },
          { name: 'ROI calculator send', subtasks: ['Build ROI calculator', 'Embed in email', 'Write intro copy', 'Personalise with lead data', 'Send to hot leads'] },
          { name: 'Personalised offer email', subtasks: ['Segment by intent score', 'Write personalised offer', 'Design layout', 'Add expiry date', 'Send and track'] },
          { name: 'Sales-assisted email', subtasks: ['Identify target accounts', 'Write 1:1 copy template', 'Personalise per rep', 'Schedule from CRM', 'Track replies'] },
        ],
      },
      {
        name: 'Intent-based paid ads',
        description: 'Bid on high-intent keywords and competitor terms.',
        tasks: [
          { name: 'Branded search campaign', subtasks: ['Add brand keywords', 'Write responsive ads', 'Set bid strategy', 'Launch', 'Monitor impression share'] },
          { name: 'Competitor keyword campaign', subtasks: ['Research competitor terms', 'Write comparative ads', 'Legal review', 'Set budget', 'Track CTR'] },
          { name: 'Bottom-funnel keyword ads', subtasks: ['Define buying keywords', 'Write ad copy', 'Create landing page', 'Launch', 'Optimise Quality Score'] },
          { name: 'Remarketing list for search (RLSA)', subtasks: ['Build RLSA audience', 'Adjust bids', 'Write tailored ad copy', 'Set up experiment', 'Report on lift'] },
          { name: 'Local intent targeting', subtasks: ['Define geo radius', 'Write location-specific copy', 'Set location targeting', 'Launch', 'Monitor store visits'] },
        ],
      },
      {
        name: 'Sales enablement push',
        description: 'Equip the sales team to convert high-intent leads.',
        tasks: [
          { name: 'Battle cards update', subtasks: ['Research competitor updates', 'Update battle card doc', 'Design new layout', 'Distribute to sales', 'Confirm read receipt'] },
          { name: 'Proposal template creation', subtasks: ['Define proposal structure', 'Write section templates', 'Add dynamic fields', 'Design PDF layout', 'Train sales on use'] },
          { name: 'CRM lead scoring setup', subtasks: ['Define scoring criteria', 'Configure CRM rules', 'Test with sample leads', 'Train sales team', 'Review scores weekly'] },
          { name: 'One-pager production', subtasks: ['Choose focus message', 'Write copy', 'Design layout', 'Review and approve', 'Distribute'] },
          { name: 'ROI case study pack', subtasks: ['Select 3 case studies', 'Write each narrative', 'Add results data', 'Design PDF', 'Share with sales'] },
          { name: 'Objection handling guide', subtasks: ['Collect top objections from calls', 'Write responses', 'Record video examples', 'Host in sales hub', 'Update quarterly'] },
        ],
      },
      {
        name: 'Live chat / conversational marketing',
        description: 'Engage high-intent visitors in real time.',
        tasks: [
          { name: 'Chatbot flow for pricing page', subtasks: ['Map conversation flow', 'Write bot copy', 'Configure in tool', 'Test all paths', 'Launch'] },
          { name: 'Proactive chat triggers', subtasks: ['Define trigger rules', 'Write greeting messages', 'Set delay timing', 'Configure routing', 'Monitor chat rate'] },
          { name: 'Live chat SLA setup', subtasks: ['Define response time SLA', 'Configure alerts', 'Train agents', 'Monitor compliance', 'Report weekly'] },
          { name: 'Chat-to-call escalation', subtasks: ['Design escalation flow', 'Configure handoff', 'Train agents', 'Test escalation', 'Track conversion'] },
          { name: 'Post-chat survey', subtasks: ['Write survey questions', 'Configure in tool', 'Set trigger (chat end)', 'Monitor CSAT', 'Share insights'] },
        ],
      },
      {
        name: 'Personalisation layer',
        description: 'Dynamic content and personalisation for high-intent segments.',
        tasks: [
          { name: 'Website personalisation rules', subtasks: ['Define segments', 'Write personalised headlines', 'Configure in CMS', 'QA all variants', 'Measure uplift'] },
          { name: 'Dynamic email personalisation', subtasks: ['Map personalisation fields', 'Write conditional blocks', 'Test with sample data', 'QA rendering', 'Deploy'] },
          { name: 'Account-based landing pages', subtasks: ['Identify target accounts', 'Write personalised copy', 'Build page variants', 'Set URL routing', 'Track engagement'] },
          { name: 'Recommendation engine setup', subtasks: ['Define recommendation logic', 'Integrate data source', 'Build UI component', 'QA recommendations', 'Launch'] },
          { name: 'Behaviour-triggered content', subtasks: ['Map trigger events', 'Write content per trigger', 'Implement in marketing automation', 'Test all triggers', 'Report engagement'] },
          { name: 'Predictive content testing', subtasks: ['Define hypothesis', 'Set up A/B test', 'Run for statistical significance', 'Analyse results', 'Roll out winner'] },
        ],
      },
      {
        name: 'Loyalty & incentives',
        description: 'Convert with targeted offers and loyalty incentives.',
        tasks: [
          { name: 'Limited-time offer email', subtasks: ['Define offer', 'Write urgency copy', 'Design email with countdown', 'Set send time', 'Monitor redemptions'] },
          { name: 'Exclusive bundle creation', subtasks: ['Define bundle components', 'Price bundle', 'Write value proposition', 'Design creative', 'Launch'] },
          { name: 'Referral programme launch', subtasks: ['Define referral mechanic', 'Build referral page', 'Write invite email', 'Integrate tracking', 'Promote via email'] },
          { name: 'Loyalty tier communication', subtasks: ['Define tier benefits', 'Write tier upgrade email', 'Design loyalty card visual', 'Launch', 'Monitor tier movement'] },
          { name: 'Win-back incentive campaign', subtasks: ['Define lapsed segment', 'Write win-back copy', 'Create exclusive offer', 'Set sequence timing', 'Report re-activations'] },
        ],
      },
    ],
  },
  {
    label: 'Conversion',
    icon: 'launch',
    actions: [
      {
        name: 'Checkout optimisation',
        description: 'Reduce friction in the purchase flow.',
        tasks: [
          { name: 'Checkout page CRO audit', subtasks: ['Review session recordings', 'Identify drop-off steps', 'Prioritise fixes', 'Implement changes', 'A/B test'] },
          { name: 'Guest checkout enable', subtasks: ['Define guest flow', 'Implement in checkout', 'QA across browsers', 'Monitor impact on CVR', 'Report'] },
          { name: 'Payment method expansion', subtasks: ['Research preferred methods', 'Integrate new gateway', 'QA payment flows', 'Communicate to customers', 'Track adoption'] },
          { name: 'Order confirmation email', subtasks: ['Write confirmation copy', 'Add order summary block', 'Design template', 'Test trigger', 'Monitor delivery rate'] },
          { name: 'Trust signal placement', subtasks: ['Design trust badges', 'Place near CTA', 'A/B test placement', 'Measure CVR impact', 'Document winning variant'] },
          { name: 'Mobile checkout QA', subtasks: ['Test on iOS Safari', 'Test on Android Chrome', 'Fix form field issues', 'Confirm payment works', 'Sign off'] },
        ],
      },
      {
        name: 'Last-mile sales push',
        description: 'Final nudge activities to close deals in pipeline.',
        tasks: [
          { name: 'Urgency email sequence', subtasks: ['Write day 1 email', 'Write day 3 email', 'Write day 7 email', 'Design templates', 'Schedule sends'] },
          { name: 'Personalised video outreach', subtasks: ['Record personalised videos', 'Upload to Loom/Vidyard', 'Embed in email', 'Track open and play rate', 'Follow up'] },
          { name: 'Discount approval workflow', subtasks: ['Define discount tiers', 'Build approval flow', 'Train sales team', 'Monitor discount usage', 'Report margin impact'] },
          { name: 'Contract red-line process', subtasks: ['Review standard contract', 'Identify negotiation points', 'Legal review', 'Counter-sign workflow', 'Archive signed contract'] },
          { name: 'Executive sponsorship outreach', subtasks: ['Identify executive stakeholders', 'Write exec-level email', 'Schedule call', 'Prepare exec brief', 'Follow up post-call'] },
        ],
      },
      {
        name: 'Promotional campaigns',
        description: 'Time-limited promotions to accelerate conversion.',
        tasks: [
          { name: 'Sale landing page', subtasks: ['Write sale headline', 'Design page layout', 'Implement countdown timer', 'QA on mobile', 'Launch'] },
          { name: 'Flash sale email blast', subtasks: ['Write urgency subject line', 'Design email', 'Set send time', 'Monitor opens', 'Report revenue'] },
          { name: 'Bundle discount campaign', subtasks: ['Define bundle', 'Set discount amount', 'Write promotional copy', 'Design creative', 'Deploy'] },
          { name: 'Seasonal campaign creative', subtasks: ['Define seasonal theme', 'Commission design assets', 'Write seasonal copy', 'Review assets', 'Deploy across channels'] },
          { name: 'Abandoned cart recovery', subtasks: ['Write cart email 1 (1h)', 'Write cart email 2 (24h)', 'Write cart email 3 (72h + offer)', 'Set up trigger sequence', 'Track recovery rate'] },
          { name: 'FOMO social proof widgets', subtasks: ['Choose social proof tool', 'Configure popups', 'Set display rules', 'A/B test', 'Measure CVR impact'] },
        ],
      },
      {
        name: 'Conversion rate testing',
        description: 'Systematic A/B and multivariate testing to lift conversion.',
        tasks: [
          { name: 'Landing page headline test', subtasks: ['Define hypothesis', 'Write 2 variants', 'Set up test in tool', 'Run to significance', 'Implement winner'] },
          { name: 'CTA button colour test', subtasks: ['Choose variants', 'Implement in page', 'Set traffic split', 'Monitor for 2 weeks', 'Roll out winner'] },
          { name: 'Form length test', subtasks: ['Define short form', 'Define long form', 'Set up A/B test', 'Collect data', 'Report CVR vs data quality'] },
          { name: 'Price anchor test', subtasks: ['Define pricing display options', 'Implement variants', 'Run test', 'Analyse conversion by variant', 'Implement winner'] },
          { name: 'Social proof placement test', subtasks: ['Define placement options', 'Implement variants', 'Run for statistical significance', 'Report uplift', 'Standardise'] },
        ],
      },
      {
        name: 'Partner co-sell activation',
        description: 'Activate channel partners to co-sell and expand reach.',
        tasks: [
          { name: 'Partner portal update', subtasks: ['Upload new campaign assets', 'Write partner brief', 'Update co-sell playbook', 'Notify partners', 'Track asset downloads'] },
          { name: 'Partner enablement webinar', subtasks: ['Schedule session', 'Prepare deck', 'Send invites', 'Run webinar', 'Share recording'] },
          { name: 'Co-branded landing page', subtasks: ['Agree on co-brand guidelines', 'Design page', 'Write joint value prop', 'Launch', 'Track leads by partner'] },
          { name: 'Partner MDF activation', subtasks: ['Define MDF activities', 'Approve budgets', 'Distribute funds', 'Monitor spend', 'Report outcomes'] },
          { name: 'Joint press release', subtasks: ['Draft release', 'Get partner approval', 'Legal sign-off', 'Distribute via wire', 'Track pickups'] },
          { name: 'Referral tracking setup', subtasks: ['Define attribution model', 'Implement UTM parameters', 'Configure CRM tagging', 'QA attribution', 'Report monthly'] },
        ],
      },
    ],
  },
  {
    label: 'Onboarding',
    icon: 'scale',
    actions: [
      {
        name: 'Day-1 welcome sequence',
        description: 'Immediate post-purchase communications to set expectations.',
        tasks: [
          { name: 'Welcome email', subtasks: ['Write warm welcome', 'Add account details', 'Link to getting-started guide', 'Design layout', 'Test trigger'] },
          { name: 'App download push notification', subtasks: ['Write push copy', 'Set trigger (purchase)', 'Test on iOS', 'Test on Android', 'Monitor install rate'] },
          { name: 'SMS confirmation', subtasks: ['Write SMS copy', 'Set trigger', 'Test delivery', 'Monitor opt-outs', 'Report CTR'] },
          { name: 'In-app welcome banner', subtasks: ['Write banner copy', 'Design banner', 'Implement in app', 'Set dismissal logic', 'Track engagement'] },
          { name: 'CS introductory email', subtasks: ['Write personalised intro', 'Assign CS rep', 'Schedule follow-up call', 'Set reminder', 'Log in CRM'] },
          { name: 'Onboarding checklist in-app', subtasks: ['Define checklist items', 'Build checklist component', 'Wire to user events', 'Design UI', 'QA all steps'] },
        ],
      },
      {
        name: 'Feature activation emails',
        description: 'Drive adoption of key product features.',
        tasks: [
          { name: 'Core feature spotlight 1', subtasks: ['Choose feature', 'Write educational copy', 'Add GIF walkthrough', 'Design email', 'Schedule send'] },
          { name: 'Core feature spotlight 2', subtasks: ['Choose feature', 'Write copy', 'Add video link', 'Design email', 'Send at day 3'] },
          { name: 'Advanced feature intro', subtasks: ['Choose power feature', 'Write value-focused copy', 'Link to documentation', 'Design', 'Send at day 7'] },
          { name: 'Integration spotlight', subtasks: ['Choose popular integration', 'Write setup guide', 'Add screenshots', 'Design email', 'Send at day 10'] },
          { name: 'Power-user tips email', subtasks: ['Collect tips from CS', 'Write tip list', 'Add links to resources', 'Design', 'Send at day 14'] },
        ],
      },
      {
        name: 'Customer success touchpoints',
        description: 'Structured CS outreach to ensure early value.',
        tasks: [
          { name: 'Day-3 health check call', subtasks: ['Schedule call', 'Prepare talking points', 'Conduct call', 'Log notes in CRM', 'Send follow-up summary'] },
          { name: 'Week-2 value review', subtasks: ['Pull usage data', 'Prepare review deck', 'Present to customer', 'Agree on action items', 'Log outcomes'] },
          { name: 'Escalation process setup', subtasks: ['Define escalation triggers', 'Set up alert in CRM', 'Assign escalation owner', 'Document process', 'Train CS team'] },
          { name: 'NPS survey send', subtasks: ['Write NPS question', 'Configure survey tool', 'Set trigger (day 14)', 'Monitor responses', 'Act on detractors'] },
          { name: 'Success metrics report', subtasks: ['Define KPIs', 'Pull data', 'Build report template', 'Send to customer', 'Review in QBR'] },
          { name: 'Champion identification', subtasks: ['Identify engaged user', 'Invite to champion programme', 'Provide resources', 'Feature in case study', 'Maintain relationship'] },
        ],
      },
      {
        name: 'Training & education',
        description: 'Structured learning to accelerate time-to-value.',
        tasks: [
          { name: 'Product training session', subtasks: ['Schedule session', 'Build training deck', 'Conduct session', 'Share recording', 'Send follow-up resources'] },
          { name: 'Knowledge base articles', subtasks: ['Identify top support topics', 'Write articles', 'Add screenshots', 'Publish in help centre', 'Link from in-app'] },
          { name: 'Video tutorial series', subtasks: ['Script 5 tutorials', 'Record videos', 'Edit and caption', 'Upload to YouTube/LMS', 'Link from onboarding email'] },
          { name: 'Live Q&A session', subtasks: ['Schedule session', 'Promote to new users', 'Prepare FAQ answers', 'Host session', 'Send recording'] },
          { name: 'Certification programme', subtasks: ['Define curriculum', 'Build assessment', 'Issue certificates', 'Promote on LinkedIn', 'Track completion rate'] },
        ],
      },
      {
        name: 'Community & peer network',
        description: 'Connect new customers with a community for peer support.',
        tasks: [
          { name: 'Community invite email', subtasks: ['Write invite copy', 'Link to community platform', 'Design email', 'Set trigger (day 2)', 'Track join rate'] },
          { name: 'Onboarding office hours', subtasks: ['Schedule recurring sessions', 'Invite new users', 'Facilitate discussion', 'Capture feedback', 'Iterate format'] },
          { name: 'Peer matching programme', subtasks: ['Define matching criteria', 'Build matching workflow', 'Send intro email', 'Track connection rate', 'Measure NPS impact'] },
          { name: 'Community welcome thread', subtasks: ['Create welcome post', 'Pin in community', 'Encourage introductions', 'Respond to all posts', 'Measure engagement'] },
          { name: 'User group setup', subtasks: ['Define user group categories', 'Create group spaces', 'Invite relevant users', 'Seed initial discussions', 'Appoint moderators'] },
          { name: 'Ambassador recruitment', subtasks: ['Identify engaged users', 'Write ambassador invitation', 'Define benefits', 'Onboard ambassadors', 'Manage programme'] },
        ],
      },
    ],
  },
  {
    label: 'Retention',
    icon: 'scale',
    actions: [
      {
        name: 'Engagement email programme',
        description: 'Ongoing emails to keep active customers engaged.',
        tasks: [
          { name: 'Monthly newsletter', subtasks: ['Plan content', 'Write editorial', 'Curate resources', 'Design layout', 'Send and measure opens'] },
          { name: 'Product update announcements', subtasks: ['Compile release notes', 'Write customer-friendly copy', 'Design email', 'Segment by plan', 'Send'] },
          { name: 'Usage milestone emails', subtasks: ['Define milestones', 'Write congrats copy', 'Add personalisation', 'Set triggers', 'Track engagement'] },
          { name: 'Re-engagement for dormant users', subtasks: ['Define dormancy threshold', 'Write re-engagement copy', 'Add incentive', 'Set trigger', 'Report reactivation rate'] },
          { name: 'Anniversary email', subtasks: ['Set anniversary trigger', 'Write celebratory copy', 'Add loyalty reward', 'Design email', 'Monitor CTR'] },
          { name: 'Educational drip series', subtasks: ['Choose topic sequence', 'Write 5 emails', 'Design templates', 'Set drip schedule', 'Track engagement per email'] },
        ],
      },
      {
        name: 'In-product engagement',
        description: 'In-app touchpoints to drive feature adoption and habit formation.',
        tasks: [
          { name: 'In-app tooltips for new features', subtasks: ['Identify new features', 'Write tooltip copy', 'Implement in app', 'A/B test display trigger', 'Measure adoption lift'] },
          { name: 'Daily digest notification', subtasks: ['Define digest content', 'Build digest template', 'Set delivery time', 'Allow user preference', 'Monitor open rate'] },
          { name: 'Feature usage nudges', subtasks: ['Identify underused features', 'Write nudge copy', 'Set inactivity trigger', 'Implement in-app', 'Track adoption'] },
          { name: 'Gamification layer', subtasks: ['Define achievement system', 'Build badge components', 'Wire to user events', 'Design UI', 'Launch and promote'] },
          { name: 'Personalised dashboard', subtasks: ['Define personalisation signals', 'Build widget system', 'Implement drag-and-drop', 'QA all widgets', 'Rollout to users'] },
        ],
      },
      {
        name: 'Customer health monitoring',
        description: 'Proactive monitoring to identify at-risk accounts.',
        tasks: [
          { name: 'Health score definition', subtasks: ['Define metrics', 'Weight each metric', 'Implement in analytics tool', 'Validate scores', 'Set thresholds'] },
          { name: 'At-risk alert system', subtasks: ['Set health score threshold', 'Configure alert in CRM', 'Assign to CS rep', 'Define intervention playbook', 'Review weekly'] },
          { name: 'QBR programme', subtasks: ['Define QBR agenda template', 'Schedule with accounts', 'Prepare data pack', 'Conduct QBR', 'Send follow-up summary'] },
          { name: 'Churn prediction model', subtasks: ['Collect historical churn data', 'Build model', 'Validate accuracy', 'Integrate into CRM', 'Act on predictions'] },
          { name: 'Expansion opportunity flagging', subtasks: ['Define expansion signals', 'Configure in CRM', 'Assign to account manager', 'Track upsell pipeline', 'Report monthly'] },
          { name: 'Sentiment analysis programme', subtasks: ['Define data sources', 'Implement NLP analysis', 'Build dashboard', 'Set alert thresholds', 'Monthly review with leadership'] },
        ],
      },
      {
        name: 'Advocacy & referrals',
        description: 'Turn loyal customers into active brand advocates.',
        tasks: [
          { name: 'Case study production', subtasks: ['Identify willing customer', 'Interview and gather data', 'Write case study', 'Design PDF', 'Publish and promote'] },
          { name: 'Referral programme management', subtasks: ['Monitor referral submissions', 'Process rewards', 'Send thank-you email', 'Track referred revenue', 'Report ROI'] },
          { name: 'Review campaign', subtasks: ['Identify promoters (NPS 9-10)', 'Write review request email', 'Add review platform links', 'Follow up once', 'Track new reviews'] },
          { name: 'Speaking opportunity matching', subtasks: ['Identify conferences', 'Match with customer advocates', 'Prepare speaking brief', 'Coordinate logistics', 'Amplify post-event'] },
          { name: 'Advisory board outreach', subtasks: ['Define advisory board criteria', 'Identify candidates', 'Write invitation', 'Onboard members', 'Run quarterly sessions'] },
        ],
      },
      {
        name: 'Renewal management',
        description: 'Structured process to ensure on-time renewals.',
        tasks: [
          { name: '90-day renewal notification', subtasks: ['Set renewal trigger', 'Write notification email', 'Assign to CS rep', 'Log in CRM', 'Track renewal status'] },
          { name: 'Renewal value review', subtasks: ['Compile usage data', 'Build value review deck', 'Schedule call', 'Present findings', 'Confirm renewal intent'] },
          { name: 'Contract renewal workflow', subtasks: ['Generate renewal proposal', 'Send via DocuSign', 'Chase signature', 'Log signed contract', 'Update billing'] },
          { name: 'Expansion upsell at renewal', subtasks: ['Identify upsell opportunity', 'Write upsell proposal', 'Present to decision-maker', 'Negotiate terms', 'Close'] },
          { name: 'At-risk renewal intervention', subtasks: ['Identify at-risk renewals', 'Escalate to leadership', 'Develop save plan', 'Execute plan', 'Report outcome'] },
          { name: 'Post-renewal thank you', subtasks: ['Write thank-you message', 'Include renewal summary', 'Offer executive sponsor intro', 'Send via email', 'Log in CRM'] },
        ],
      },
    ],
  },
  {
    label: 'Expansion',
    icon: 'scale',
    actions: [
      {
        name: 'Upsell campaigns',
        description: 'Convert existing customers to higher-tier plans.',
        tasks: [
          { name: 'Usage-based upsell trigger', subtasks: ['Define usage threshold', 'Write upsell email', 'Add upgrade CTA', 'Set automation trigger', 'Track conversion rate'] },
          { name: 'Plan comparison email', subtasks: ['Write comparison copy', 'Design comparison table', 'Add testimonials from higher tier', 'Design email', 'Send to target segment'] },
          { name: 'Upgrade incentive offer', subtasks: ['Define incentive', 'Write offer email', 'Set expiry', 'Design layout', 'Monitor upgrade rate'] },
          { name: 'In-app upgrade prompt', subtasks: ['Define trigger (feature gate)', 'Write prompt copy', 'Design modal', 'Implement', 'A/B test CTA'] },
          { name: 'Sales-led upsell call', subtasks: ['Identify upsell candidates', 'Prepare call brief', 'Conduct call', 'Send follow-up proposal', 'Close and log'] },
          { name: 'Feature preview for higher tier', subtasks: ['Enable preview for 7 days', 'Write teaser email', 'Set expiry reminder', 'Convert preview to paid', 'Report conversion'] },
        ],
      },
      {
        name: 'Cross-sell campaigns',
        description: 'Drive adoption of complementary products.',
        tasks: [
          { name: 'Cross-sell email sequence', subtasks: ['Identify complementary product', 'Write value proposition', 'Design email', 'Set send schedule', 'Track adoption'] },
          { name: 'In-app cross-sell banner', subtasks: ['Write banner copy', 'Design creative', 'Define display rules', 'Implement', 'Monitor CTR'] },
          { name: 'Bundle offer creation', subtasks: ['Define bundle', 'Price bundle', 'Write promotional copy', 'Create landing page', 'Launch'] },
          { name: 'CS-led cross-sell conversation', subtasks: ['Train CS on cross-sell', 'Identify opportunities in QBR', 'Present to customer', 'Follow up', 'Log revenue'] },
          { name: 'Integration-triggered cross-sell', subtasks: ['Identify integration cross-sell', 'Set trigger (integration installed)', 'Write email', 'Launch automation', 'Monitor conversion'] },
        ],
      },
      {
        name: 'Account expansion plays',
        description: 'Grow headcount and seat usage within existing accounts.',
        tasks: [
          { name: 'Seat expansion email', subtasks: ['Identify accounts near seat limit', 'Write email', 'Add upgrade CTA', 'Set automation', 'Track seat expansion'] },
          { name: 'Team invite feature push', subtasks: ['Write in-app message', 'Implement invite nudge', 'Design invite modal', 'Track invites sent', 'Measure activation of invitees'] },
          { name: 'Departmental expansion pitch', subtasks: ['Identify adjacent department', 'Prepare business case', 'Schedule intro call', 'Present to new stakeholders', 'Close expansion'] },
          { name: 'Executive stakeholder mapping', subtasks: ['Map org chart', 'Identify key stakeholders', 'Warm introduction via champion', 'Schedule meeting', 'Build relationship'] },
          { name: 'Multi-year deal incentive', subtasks: ['Define multi-year discount', 'Write proposal', 'Present to account', 'Negotiate', 'Close and contract'] },
          { name: 'Usage report to sponsor', subtasks: ['Pull usage analytics', 'Build report', 'Design executive summary', 'Send to sponsor', 'Schedule review call'] },
        ],
      },
      {
        name: 'Partner & ecosystem expansion',
        description: 'Grow revenue through partner-led expansion.',
        tasks: [
          { name: 'Partner-led upsell programme', subtasks: ['Identify partners with upsell potential', 'Create incentive scheme', 'Brief partners', 'Track partner upsell pipeline', 'Report partner revenue'] },
          { name: 'Marketplace listing optimisation', subtasks: ['Audit current listing', 'Update screenshots', 'Improve description', 'Add customer reviews', 'Monitor ranking'] },
          { name: 'ISV integration co-sell', subtasks: ['Identify ISV partner', 'Define co-sell motion', 'Build joint solution brief', 'Train sales teams', 'Track joint pipeline'] },
          { name: 'GSI partnership activation', subtasks: ['Identify GSI partner', 'Define engagement model', 'Train partner team', 'Build joint GTM plan', 'Execute pilot'] },
          { name: 'Technology alliance co-marketing', subtasks: ['Agree joint campaign', 'Co-create content', 'Launch to combined audience', 'Track leads', 'Share revenue attribution'] },
        ],
      },
      {
        name: 'New market entry',
        description: 'Expand product reach into new geographies or verticals.',
        tasks: [
          { name: 'Market sizing analysis', subtasks: ['Define target market', 'Research TAM/SAM/SOM', 'Validate with customer interviews', 'Present findings', 'Go/no-go decision'] },
          { name: 'Localisation sprint', subtasks: ['Define languages', 'Translate key assets', 'Localise product UI', 'QA translations', 'Launch in new locale'] },
          { name: 'Local partnership identification', subtasks: ['Research local partners', 'Prioritise by reach', 'Outreach and pitch', 'Sign partnership agreement', 'Activate partnership'] },
          { name: 'Vertical-specific landing page', subtasks: ['Write vertical copy', 'Add vertical case studies', 'Design page', 'Set up analytics', 'Launch and promote'] },
          { name: 'Vertical event presence', subtasks: ['Identify trade shows', 'Book booth', 'Prepare materials', 'Brief sales team', 'Follow up with leads'] },
          { name: 'Regulatory compliance review', subtasks: ['Identify regulations', 'Legal review', 'Gap analysis', 'Remediation plan', 'Sign-off for launch'] },
        ],
      },
    ],
  },
  {
    label: 'Advocacy',
    icon: 'maintenance',
    actions: [
      {
        name: 'Customer story programme',
        description: 'Systematically capture and publish customer success stories.',
        tasks: [
          { name: 'Story pipeline management', subtasks: ['Identify story candidates', 'Qualify willingness', 'Sign release form', 'Schedule interview', 'Assign writer'] },
          { name: 'Written case study production', subtasks: ['Conduct interview', 'Write case study', 'Customer review and approval', 'Design PDF', 'Publish on website'] },
          { name: 'Video testimonial production', subtasks: ['Script questions', 'Film interview', 'Edit video', 'Add captions', 'Publish on YouTube and site'] },
          { name: 'Social proof quote extraction', subtasks: ['Extract key quotes', 'Get approval', 'Design quote cards', 'Schedule social posts', 'Add to website'] },
          { name: 'Case study promotion campaign', subtasks: ['Write promotional email', 'Promote on LinkedIn', 'Run paid amplification', 'Track downloads', 'Report attribution'] },
          { name: 'Case study localisation', subtasks: ['Identify top stories for localisation', 'Translate content', 'Localise design', 'Publish per region', 'Promote locally'] },
        ],
      },
      {
        name: 'Review & rating campaigns',
        description: 'Drive authentic reviews on key platforms.',
        tasks: [
          { name: 'G2 review campaign', subtasks: ['Identify happy customers', 'Write review request email', 'Add G2 link', 'Send follow-up', 'Track new reviews'] },
          { name: 'Gartner Peer Insights', subtasks: ['Register profile', 'Invite customers to review', 'Respond to reviews', 'Apply for badges', 'Monitor ranking'] },
          { name: 'App store review ask', subtasks: ['Implement in-app review prompt', 'Define trigger event', 'Test prompt', 'Monitor store rating', 'Respond to negative reviews'] },
          { name: 'Trust Pilot management', subtasks: ['Claim profile', 'Send review invites', 'Respond to all reviews', 'Display on website', 'Monitor weekly'] },
          { name: 'Product Hunt launch', subtasks: ['Prepare launch materials', 'Build hunter network', 'Set launch date', 'Execute launch day', 'Follow up with voters'] },
        ],
      },
      {
        name: 'Ambassador programme',
        description: 'Build and manage a structured customer ambassador network.',
        tasks: [
          { name: 'Ambassador recruitment campaign', subtasks: ['Define criteria', 'Write recruitment email', 'Build application page', 'Review applications', 'Welcome new ambassadors'] },
          { name: 'Ambassador benefits package', subtasks: ['Define benefits', 'Design benefits guide', 'Set up exclusive Slack channel', 'Provide early access', 'Deliver quarterly rewards'] },
          { name: 'Ambassador content creation', subtasks: ['Brief content guidelines', 'Review ambassador posts', 'Amplify top content', 'Feature in newsletter', 'Measure reach'] },
          { name: 'Ambassador summit', subtasks: ['Plan event agenda', 'Invite ambassadors', 'Run summit', 'Collect feedback', 'Publish recap'] },
          { name: 'Ambassador NPS tracking', subtasks: ['Send quarterly survey', 'Analyse results', 'Identify programme improvements', 'Implement changes', 'Report to leadership'] },
          { name: 'Co-create product roadmap input', subtasks: ['Invite ambassadors to roadmap session', 'Collect prioritised feedback', 'Share with product team', 'Report back to ambassadors', 'Acknowledge contributions'] },
        ],
      },
      {
        name: 'Community growth',
        description: 'Grow and activate the customer community.',
        tasks: [
          { name: 'Community content calendar', subtasks: ['Plan monthly topics', 'Assign content creators', 'Schedule posts', 'Monitor engagement', 'Adjust calendar based on data'] },
          { name: 'Community challenge campaign', subtasks: ['Design challenge concept', 'Write challenge brief', 'Announce in community', 'Celebrate participants', 'Share results'] },
          { name: 'AMA (Ask Me Anything) sessions', subtasks: ['Schedule AMA', 'Promote in community', 'Prepare expert host', 'Run session', 'Publish transcript'] },
          { name: 'Community newsletter', subtasks: ['Curate top community posts', 'Write editorial section', 'Design newsletter', 'Send to members', 'Track open rate'] },
          { name: 'Power user spotlights', subtasks: ['Identify power users', 'Interview for spotlight', 'Write profile', 'Publish in community', 'Promote on social'] },
        ],
      },
      {
        name: 'Industry influence',
        description: 'Establish brand as a thought leader via speaking and awards.',
        tasks: [
          { name: 'Conference speaking submissions', subtasks: ['Research CFP deadlines', 'Write session abstracts', 'Submit to 5+ conferences', 'Track acceptances', 'Prepare presentations'] },
          { name: 'Industry award submissions', subtasks: ['Identify relevant awards', 'Write submissions', 'Gather supporting data', 'Submit before deadline', 'Promote wins'] },
          { name: 'Analyst briefing programme', subtasks: ['Identify target analysts', 'Request briefings', 'Prepare briefing deck', 'Conduct briefing', 'Follow up with data'] },
          { name: 'Thought leadership content', subtasks: ['Define POV topics', 'Write byline articles', 'Pitch to publications', 'Publish and promote', 'Measure reach'] },
          { name: 'Research report production', subtasks: ['Define research question', 'Design survey', 'Field survey', 'Analyse data', 'Publish and promote report'] },
          { name: 'Podcast hosting programme', subtasks: ['Define podcast concept', 'Set up recording setup', 'Book guests', 'Record 6 episodes', 'Launch and promote'] },
        ],
      },
    ],
  },
  {
    label: 'Win-back',
    icon: 'maintenance',
    actions: [
      {
        name: 'Churn identification & triage',
        description: 'Detect and categorise churned or at-risk accounts.',
        tasks: [
          { name: 'Churn data pull', subtasks: ['Define churn date range', 'Pull from CRM', 'Segment by revenue band', 'Segment by churn reason', 'Export for campaign use'] },
          { name: 'Exit survey analysis', subtasks: ['Collect exit survey data', 'Categorise reasons', 'Identify top themes', 'Share insights with product', 'Inform win-back messaging'] },
          { name: 'Win-back scoring model', subtasks: ['Define win-back potential signals', 'Build scoring logic', 'Apply to churned list', 'Prioritise top accounts', 'Pass to sales'] },
          { name: 'Competitive loss analysis', subtasks: ['Identify competitor wins', 'Interview churned accounts (optional)', 'Document reasons', 'Share with product and sales', 'Update battle cards'] },
          { name: 'Win-back budget approval', subtasks: ['Define target win-back revenue', 'Build business case', 'Present to leadership', 'Get budget approved', 'Assign to campaign manager'] },
          { name: 'Suppression list management', subtasks: ['Identify do-not-contact accounts', 'Add to suppression list', 'Apply to all win-back sends', 'Review suppression quarterly', 'Document compliance'] },
        ],
      },
      {
        name: 'Win-back email campaign',
        description: 'Targeted email sequence to re-engage churned accounts.',
        tasks: [
          { name: 'Win-back email 1 — "We miss you"', subtasks: ['Write empathetic copy', 'Add key product updates', 'Design email', 'Set send timing', 'Track open rate'] },
          { name: 'Win-back email 2 — new features', subtasks: ['Highlight improvements since churn', 'Write feature update copy', 'Add visuals', 'Design email', 'Send at day 7'] },
          { name: 'Win-back email 3 — incentive offer', subtasks: ['Define special offer', 'Write urgency copy', 'Add offer CTA', 'Set expiry', 'Monitor redemptions'] },
          { name: 'Win-back email 4 — last chance', subtasks: ['Write final nudge copy', 'Add offer reminder', 'Design email', 'Set send at day 21', 'Monitor conversions'] },
          { name: 'Post win-back welcome sequence', subtasks: ['Write re-onboarding email', 'Add quick-start resources', 'Trigger on re-activation', 'Monitor engagement', 'Flag to CS'] },
        ],
      },
      {
        name: 'Sales-led win-back',
        description: 'Direct outreach from sales to high-value churned accounts.',
        tasks: [
          { name: 'Target account prioritisation', subtasks: ['Sort by ARR', 'Apply win-back score', 'Assign to AE', 'Set outreach deadline', 'Log in CRM'] },
          { name: 'Personalised video outreach', subtasks: ['Record personalised videos', 'Embed in email', 'Send to target list', 'Track plays', 'Follow up on viewers'] },
          { name: 'Product improvements pitch', subtasks: ['Prepare "what has changed" deck', 'Personalise per account', 'Schedule call', 'Present improvements', 'Handle objections'] },
          { name: 'Special pricing approval', subtasks: ['Define win-back pricing', 'Get approval', 'Document terms', 'Present to account', 'Close'] },
          { name: 'Executive-level reconnection', subtasks: ['Identify executive contact', 'Write exec-level message', 'Request meeting', 'Conduct meeting', 'Follow up with proposal'] },
          { name: 'Win-back closed deal debrief', subtasks: ['Conduct win debrief', 'Document what worked', 'Share with marketing', 'Update playbook', 'Recognise AE achievement'] },
        ],
      },
      {
        name: 'Product-led win-back',
        description: 'Free access or feature previews to re-engage churned users.',
        tasks: [
          { name: 'Free trial re-activation offer', subtasks: ['Define re-activation terms', 'Build landing page', 'Write email', 'Set up account re-activation', 'Track conversions'] },
          { name: 'New feature showcase invite', subtasks: ['Identify most impactful new features', 'Write email', 'Link to demo video', 'Send to churned list', 'Monitor re-engagement'] },
          { name: 'Personalised sandbox access', subtasks: ['Set up sandbox environment', 'Pre-populate with relevant data', 'Send access credentials', 'Offer guided tour', 'Track sandbox activity'] },
          { name: 'Feedback-to-feature communication', subtasks: ['Identify accounts who cited missing feature', 'Write email announcing feature', 'Add direct link', 'Offer re-trial', 'Track response'] },
          { name: 'ROI improvement report', subtasks: ['Calculate potential ROI post-improvement', 'Write personalised report', 'Design PDF', 'Send to churned account', 'Follow up with CS call'] },
        ],
      },
      {
        name: 'Win-back measurement',
        description: 'Track and optimise win-back programme performance.',
        tasks: [
          { name: 'Win-back dashboard setup', subtasks: ['Define metrics', 'Build in BI tool', 'Set up data feeds', 'QA data accuracy', 'Share with stakeholders'] },
          { name: 'Weekly win-back review', subtasks: ['Pull weekly metrics', 'Identify top performers', 'Flag blockers', 'Adjust campaign', 'Send summary to leadership'] },
          { name: 'Win-back A/B test programme', subtasks: ['Define test hypotheses', 'Set up A/B test', 'Run for statistical significance', 'Implement winner', 'Document learnings'] },
          { name: 'Attribution model for win-backs', subtasks: ['Define attribution rules', 'Implement in CRM', 'QA attributed revenue', 'Report monthly', 'Review model annually'] },
          { name: 'Post-win-back retention tracking', subtasks: ['Tag re-won accounts', 'Track health score', 'Monitor 90-day retention', 'Flag at-risk re-won accounts', 'Report outcome'] },
          { name: 'Win-back programme QBR', subtasks: ['Compile quarterly metrics', 'Prepare QBR deck', 'Present to leadership', 'Agree on budget and priorities', 'Document decisions'] },
        ],
      },
    ],
  },
  {
    label: 'Re-engagement',
    icon: 'maintenance',
    actions: [
      {
        name: 'Dormant user identification',
        description: 'Identify and segment disengaged users.',
        tasks: [
          { name: 'Dormancy threshold definition', subtasks: ['Define dormancy by product', 'Agree with product team', 'Implement in analytics', 'QA segment', 'Document criteria'] },
          { name: 'Dormant user segmentation', subtasks: ['Pull dormant users', 'Segment by tier', 'Segment by last activity', 'Score by re-engagement potential', 'Export for campaign'] },
          { name: 'Reason-for-dormancy survey', subtasks: ['Write 3-question survey', 'Send to dormant users', 'Analyse results', 'Identify top reasons', 'Inform campaign messaging'] },
          { name: 'Dormant list hygiene', subtasks: ['Remove unsubscribes', 'Remove hard bounces', 'Apply suppression list', 'Validate emails', 'Final QA before send'] },
          { name: 'Re-engagement priority scoring', subtasks: ['Define scoring variables', 'Apply to dormant list', 'Rank accounts', 'Assign top accounts to CS', 'Report distribution'] },
          { name: 'Dormancy reporting setup', subtasks: ['Define dormancy KPIs', 'Build report in BI tool', 'Set up weekly alerts', 'Review with CS weekly', 'Adjust thresholds quarterly'] },
        ],
      },
      {
        name: 'Re-engagement email series',
        description: 'Targeted email series to reignite interest.',
        tasks: [
          { name: 'Re-engagement email 1 — check in', subtasks: ['Write friendly check-in copy', 'Add personalisation', 'Design email', 'Set trigger', 'Monitor open rate'] },
          { name: 'Re-engagement email 2 — value reminder', subtasks: ['Highlight key value', 'Add success story', 'Design email', 'Send at day 5', 'Track CTR'] },
          { name: 'Re-engagement email 3 — new content', subtasks: ['Share relevant new content', 'Write copy', 'Add CTA', 'Design email', 'Send at day 10'] },
          { name: 'Re-engagement email 4 — incentive', subtasks: ['Define incentive', 'Write urgency copy', 'Design email', 'Set expiry', 'Monitor redemptions'] },
          { name: 'Sunset email — unsubscribe or stay', subtasks: ['Write sunset copy', 'Add stay/unsubscribe CTA', 'Set design', 'Send at day 21', 'Process unsubscribes'] },
        ],
      },
      {
        name: 'In-app re-activation',
        description: 'Product-led nudges to bring dormant users back into the product.',
        tasks: [
          { name: 'Re-activation in-app message', subtasks: ['Write welcome back copy', 'Design modal', 'Implement', 'Set trigger (first login after dormancy)', 'Track re-activation'] },
          { name: 'Quick win prompt', subtasks: ['Identify quick-win action', 'Write prompt copy', 'Design tooltip', 'Set trigger on login', 'Track completion rate'] },
          { name: 'New feature highlight', subtasks: ['Identify most relevant new feature', 'Write spotlight copy', 'Design in-app card', 'Implement', 'Measure feature adoption'] },
          { name: 'Personalised homepage content', subtasks: ['Define personalisation rules', 'Build content variants', 'Implement in product', 'QA per segment', 'Track engagement'] },
          { name: 'Progress summary card', subtasks: ['Define progress metrics', 'Design summary card', 'Implement in dashboard', 'Test display logic', 'Monitor engagement'] },
          { name: 'Goal-setting prompt', subtasks: ['Write goal-setting copy', 'Design goal input UI', 'Wire to user profile', 'Set notification reminders', 'Track goal completion'] },
        ],
      },
      {
        name: 'Winback content programme',
        description: 'Educational content to re-demonstrate value.',
        tasks: [
          { name: 'Product update blog post', subtasks: ['Write what is new article', 'Add screenshots', 'SEO optimise', 'Publish', 'Promote to dormant users via email'] },
          { name: 'Video re-intro series', subtasks: ['Script 3 videos', 'Record', 'Edit', 'Upload', 'Send to dormant segment'] },
          { name: 'Best practice webinar', subtasks: ['Define topic', 'Invite dormant users', 'Prepare content', 'Host session', 'Send recording to non-attendees'] },
          { name: 'Interactive product tour', subtasks: ['Define tour flow', 'Build in Appcues or Pendo', 'QA all steps', 'Send link to dormant users', 'Track completion'] },
          { name: 'Comparison guide (then vs now)', subtasks: ['Document product improvements', 'Write comparison narrative', 'Design visual guide', 'Send to dormant users', 'Track engagement'] },
        ],
      },
      {
        name: 'CS-led re-engagement',
        description: 'Human outreach for high-value dormant accounts.',
        tasks: [
          { name: 'High-value dormant account list', subtasks: ['Filter by ARR threshold', 'Cross-reference with health score', 'Assign to CS reps', 'Set outreach deadline', 'Log in CRM'] },
          { name: 'Personalised video message', subtasks: ['Record personalised video per account', 'Send via email', 'Track video plays', 'Follow up with phone call', 'Log outcome'] },
          { name: 'Needs reassessment call', subtasks: ['Schedule call', 'Prepare discovery questions', 'Conduct call', 'Document new needs', 'Propose solution'] },
          { name: 'Tailored usage report', subtasks: ['Pull account usage data', 'Identify gaps vs peers', 'Write personalised report', 'Share with account', 'Discuss on call'] },
          { name: 'Re-engagement success planning', subtasks: ['Define 30-60-90 plan', 'Present to customer', 'Agree on milestones', 'Track progress', 'Celebrate wins'] },
          { name: 'Executive business review', subtasks: ['Schedule EBR', 'Prepare business value analysis', 'Present to executive sponsor', 'Agree on re-engagement plan', 'Document commitments'] },
        ],
      },
      {
        name: 'Re-engagement measurement',
        description: 'Track the effectiveness of re-engagement efforts.',
        tasks: [
          { name: 'Re-engagement KPI dashboard', subtasks: ['Define KPIs', 'Build dashboard', 'Connect data sources', 'QA metrics', 'Share with stakeholders'] },
          { name: 'Campaign performance reporting', subtasks: ['Pull email metrics', 'Pull in-app metrics', 'Compile report', 'Present weekly', 'Iterate based on data'] },
          { name: 'Re-engagement A/B tests', subtasks: ['Define test hypothesis', 'Build test variants', 'Run test', 'Analyse results', 'Document and implement winner'] },
          { name: 'Lifecycle stage tracking', subtasks: ['Define lifecycle stages', 'Implement stage transitions in CRM', 'Build stage report', 'Review monthly', 'Adjust re-engagement criteria'] },
          { name: 'Long-term retention of re-engaged users', subtasks: ['Tag re-engaged users', 'Track 90-day churn rate', 'Compare vs. never-dormant cohort', 'Report findings', 'Inform future re-engagement strategy'] },
        ],
      },
    ],
  },
  {
    label: 'Launch',
    icon: 'launch',
    actions: [
      {
        name: 'Launch day execution',
        description: 'Coordinate all channels for simultaneous go-live.',
        tasks: [
          { name: 'Launch readiness checklist', subtasks: ['Define all launch tasks', 'Assign owners', 'Confirm completion', 'Sign-off from each team', 'Go-live approval'] },
          { name: 'Launch email send', subtasks: ['Final copy review', 'Test send to seed list', 'Confirm deliverability', 'Schedule production send', 'Monitor delivery metrics'] },
          { name: 'Social media launch posts', subtasks: ['Prepare post copy and assets', 'Schedule across all platforms', 'Coordinate simultaneous publish', 'Monitor engagement', 'Respond to comments'] },
          { name: 'Paid media activation', subtasks: ['Confirm all ads approved', 'Set campaign live', 'Monitor initial spend', 'Check for delivery issues', 'Early performance check at 4h'] },
          { name: 'PR launch wire', subtasks: ['Confirm embargo lift time', 'Submit to wire service', 'Notify key journalists', 'Monitor coverage', 'Share coverage internally'] },
          { name: 'Internal launch comms', subtasks: ['Write all-hands update', 'Send via Slack', 'Prepare sales talking points', 'Brief CS team', 'Celebrate with team'] },
        ],
      },
      {
        name: 'Post-launch monitoring',
        description: 'Real-time monitoring of launch performance.',
        tasks: [
          { name: 'Launch metrics dashboard', subtasks: ['Build real-time dashboard', 'Connect all data sources', 'Set alert thresholds', 'Assign monitoring shifts', 'Document escalation process'] },
          { name: 'Hour-1 performance check', subtasks: ['Review email open rate', 'Check social impressions', 'Review ad delivery', 'Monitor site traffic', 'Log findings'] },
          { name: 'Day-1 performance report', subtasks: ['Pull all channel metrics', 'Compare vs. targets', 'Write executive summary', 'Send to leadership', 'Identify quick optimisations'] },
          { name: 'Week-1 performance review', subtasks: ['Compile full week data', 'Analyse conversion funnel', 'Identify best performing channels', 'Reallocate budget if needed', 'Prepare week-1 report'] },
          { name: 'Customer feedback monitoring', subtasks: ['Monitor social mentions', 'Review support tickets', 'Track NPS responses', 'Compile sentiment summary', 'Share with product team'] },
        ],
      },
      {
        name: 'Post-launch optimisation',
        description: 'Rapid iteration to improve launch results.',
        tasks: [
          { name: 'Email subject line A/B test', subtasks: ['Identify best-open-rate segment', 'Write 2 subject variants', 'Set up test', 'Run for significance', 'Roll out winner'] },
          { name: 'Landing page CRO sprint', subtasks: ['Review heatmaps', 'Identify friction points', 'Implement top 3 changes', 'A/B test', 'Report CVR impact'] },
          { name: 'Ad creative refresh', subtasks: ['Identify underperforming creatives', 'Brief new assets', 'Swap in new creatives', 'Monitor performance', 'Pause losers'] },
          { name: 'Budget reallocation', subtasks: ['Review channel ROI', 'Identify top performers', 'Shift budget', 'Update forecast', 'Document decision'] },
          { name: 'Retargeting audience build', subtasks: ['Define retargeting audiences from launch traffic', 'Set up audiences in ad platforms', 'Launch retargeting campaigns', 'Monitor ROAS', 'Scale top performers'] },
          { name: 'Launch retrospective', subtasks: ['Schedule retrospective', 'Collect team input', 'Document what went well', 'Document improvements', 'Update launch playbook'] },
        ],
      },
      {
        name: 'Media & press amplification',
        description: 'Maximise earned media from the launch.',
        tasks: [
          { name: 'Journalist follow-up', subtasks: ['Identify who received press kit', 'Personalise follow-up', 'Send within 24h of launch', 'Track coverage', 'Report total media value'] },
          { name: 'Podcast pitch wave', subtasks: ['Identify 10 relevant podcasts', 'Write pitch email', 'Send to show hosts', 'Follow up after 1 week', 'Confirm recording dates'] },
          { name: 'Industry newsletter placements', subtasks: ['Identify relevant newsletters', 'Write content for each', 'Submit for inclusion', 'Track placements', 'Measure referral traffic'] },
          { name: 'LinkedIn amplification campaign', subtasks: ['Write LinkedIn post series', 'Engage employees to share', 'Boost top post', 'Track impressions', 'Report reach'] },
          { name: 'Media coverage compilation', subtasks: ['Collect all coverage links', 'Measure total impressions', 'Create coverage highlights doc', 'Share with CEO and investors', 'Publish on website'] },
        ],
      },
      {
        name: 'Sales activation at launch',
        description: 'Equip and energise the sales team on launch day.',
        tasks: [
          { name: 'Sales launch briefing', subtasks: ['Write sales briefing doc', 'Schedule briefing session', 'Brief all reps', 'Share Q&A sheet', 'Confirm all reps ready'] },
          { name: 'Launch-day calling blitz', subtasks: ['Build target call list', 'Brief reps on talk track', 'Run morning blitz session', 'Log all calls in CRM', 'Report blitz outcomes'] },
          { name: 'Launch offer expiry communication', subtasks: ['Define offer window', 'Set expiry date', 'Communicate to sales', 'Send to prospects', 'Monitor urgency conversions'] },
          { name: 'Pipeline acceleration with launch', subtasks: ['Identify stuck deals', 'Use launch as re-engagement hook', 'Schedule pipeline review', 'Move stuck deals forward', 'Report pipeline uplift'] },
          { name: 'Win stories from launch day', subtasks: ['Collect early wins', 'Write win announcement', 'Share with sales team', 'Post in Slack', 'Celebrate in weekly meeting'] },
          { name: 'Launch incentive scheme for sales', subtasks: ['Define SPIF structure', 'Communicate to sales', 'Track SPIF progress', 'Pay out at month end', 'Report SPIF effectiveness'] },
        ],
      },
      {
        name: 'Campaign wrap-up & analysis',
        description: 'Comprehensive analysis and documentation of campaign outcomes.',
        tasks: [
          { name: 'Full campaign report', subtasks: ['Pull all channel data', 'Build report structure', 'Write executive summary', 'Add visualisations', 'Distribute to stakeholders'] },
          { name: 'ROI calculation', subtasks: ['Tally all campaign costs', 'Attribute revenue', 'Calculate ROI by channel', 'Present ROI report', 'Document for future planning'] },
          { name: 'Lessons learned document', subtasks: ['Facilitate team retrospective', 'Compile lessons', 'Prioritise action items', 'Assign owners', 'Schedule follow-up review'] },
          { name: 'Playbook update', subtasks: ['Review existing playbook', 'Incorporate new learnings', 'Update templates', 'Distribute updated version', 'Communicate changes to team'] },
          { name: 'Next campaign planning kick-off', subtasks: ['Schedule planning session', 'Share campaign data for context', 'Define objectives for next campaign', 'Assign planning owners', 'Set planning timeline'] },
          { name: 'Budget reconciliation', subtasks: ['Pull all spend data', 'Compare vs. approved budget', 'Explain variances', 'Submit to finance', 'Update budget tracker'] },
        ],
      },
    ],
  },
];

// ─── seed builder ────────────────────────────────────────────────────────────

function seedPhases(versionId: string): ApiPhase[] {
  return PHASE_DEFS.map((pDef, pi) => {
    const phaseId = `phase-${pi + 1}`;
    return {
      id: phaseId,
      versionId,
      label: pDef.label,
      icon: pDef.icon,
      orderIndex: pi,
      updatedAt: null,
      updatedBy: null,
      metadata: null,
      actions: pDef.actions.map((aDef, ai) => {
        const actionId = `${phaseId}-action-${ai + 1}`;
        return {
          id: actionId,
          phaseId,
          name: aDef.name,
          description: aDef.description,
          orderIndex: ai,
          updatedAt: null,
          updatedBy: null,
          metadata: null,
          tasks: aDef.tasks.map((tDef, ti) =>
            task(`${actionId}-task-${ti + 1}`, actionId, tDef.name, ti, tDef.subtasks),
          ),
        };
      }),
    };
  });
}

export function getBuilderFromMock(versionId: string): ApiBuilderTree {
  const version = getVersionFromMock(versionId);
  const phases = readMockStore<ApiPhase[]>(builderKey(versionId), seedPhases(versionId));
  return { version, phases };
}

export function saveBuilderToMock(versionId: string, phases: ApiPhase[]): ApiBuilderTree {
  writeMockStore(builderKey(versionId), phases);
  return getBuilderFromMock(versionId);
}
