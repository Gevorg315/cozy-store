const createElement = <Tag extends keyof HTMLElementTagNameMap>(
  tag: Tag,
  className = '',
  text = '',
): HTMLElementTagNameMap[Tag] => {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text) {
    element.textContent = text;
  }

  return element;
};

export const createAboutPage = (): HTMLElement => {
  const section = createElement('section', 'about-page');

  const hero = createElement('div', 'about-hero');
  const eyebrow = createElement('p', 'eyebrow', 'WELCOME TO COZY STORE');
  const heading = createElement('h1', 'about-title', 'Make yourself at home.');
  const description = createElement(
    'p',
    'about-description',
    'Discover thoughtfully selected home essentials that bring warmth, comfort, and a little joy to everyday life.',
  );

  const shopLink = createElement('a', 'primary-button', 'Explore our collection');
  shopLink.href = '#shop';

  hero.append(eyebrow, heading, description, shopLink);

  const story = createElement('div', 'about-story');
  const storyHeading = createElement('h2', '', 'Our story');
  const storyText = createElement(
    'p',
    '',
    'Cozy Store is a small online shopping project inspired by the idea that the little things make a house feel like home. From everyday kitchen essentials to soft lighting and decorative details, our goal is to make discovering cozy products simple and enjoyable.',
  );

  story.append(storyHeading, storyText);

  const team = createElement('div', 'about-team');
  const teamHeading = createElement('h2', '', 'Meet the creator');
  const member = createElement('article', 'team-member');
  const memberName = createElement('h3', '', 'Gevorg Gevorgyan');
  const memberRole = createElement('p', 'team-role', 'Project creator and developer');
  const memberDescription = createElement(
    'p',
    '',
    'Responsible for project setup, TypeScript development, catalog logic, cart functionality, and testing.',
  );

  const githubLink = createElement('a', 'text-link', 'GitHub profile');
  githubLink.href = 'https://github.com/Gevorg315';
  githubLink.target = '_blank';
  githubLink.rel = 'noopener noreferrer';

  member.append(memberName, memberRole, memberDescription, githubLink);
  team.append(teamHeading, member);

  section.append(hero, story, team);

  return section;
};
