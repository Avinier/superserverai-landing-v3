import { diagramTheme } from '../theme';

// Import devicon CSS for font icons
import 'devicon/devicon.min.css';

// Map of common names to devicon class names
// Format: devicon-{name}-{style} where style is: original, plain, line, original-wordmark, etc.
const ICON_MAP: Record<string, string> = {
  // Databases
  postgresql: 'devicon-postgresql-plain colored',
  postgres: 'devicon-postgresql-plain colored',
  redis: 'devicon-redis-plain colored',
  mysql: 'devicon-mysql-plain colored',
  mongodb: 'devicon-mongodb-plain colored',
  sqlite: 'devicon-sqlite-plain colored',
  oracle: 'devicon-oracle-original colored',
  mariadb: 'devicon-mariadb-original colored',
  couchdb: 'devicon-couchdb-plain colored',
  dynamodb: 'devicon-dynamodb-plain colored',

  // Cloud Providers
  aws: 'devicon-amazonwebservices-plain-wordmark colored',
  amazonaws: 'devicon-amazonwebservices-plain-wordmark colored',
  gcp: 'devicon-googlecloud-plain colored',
  googlecloud: 'devicon-googlecloud-plain colored',
  azure: 'devicon-azure-plain colored',
  digitalocean: 'devicon-digitalocean-plain colored',
  heroku: 'devicon-heroku-plain colored',

  // Container & Orchestration
  docker: 'devicon-docker-plain colored',
  kubernetes: 'devicon-kubernetes-plain colored',
  k8s: 'devicon-kubernetes-plain colored',
  podman: 'devicon-podman-plain colored',

  // Platforms
  vercel: 'devicon-vercel-original',
  netlify: 'devicon-netlify-plain colored',
  cloudflare: 'devicon-cloudflare-plain colored',
  firebase: 'devicon-firebase-plain colored',

  // Version Control
  github: 'devicon-github-original',
  gitlab: 'devicon-gitlab-plain colored',
  bitbucket: 'devicon-bitbucket-original colored',
  git: 'devicon-git-plain colored',

  // Frameworks - Frontend
  nextjs: 'devicon-nextjs-original',
  'next.js': 'devicon-nextjs-original',
  react: 'devicon-react-original colored',
  vue: 'devicon-vuejs-plain colored',
  vuejs: 'devicon-vuejs-plain colored',
  angular: 'devicon-angularjs-plain colored',
  svelte: 'devicon-svelte-plain colored',
  nuxt: 'devicon-nuxtjs-plain colored',
  gatsby: 'devicon-gatsby-plain colored',

  // Frameworks - Backend
  express: 'devicon-express-original',
  fastapi: 'devicon-fastapi-plain colored',
  django: 'devicon-django-plain',
  flask: 'devicon-flask-original',
  rails: 'devicon-rails-plain colored',
  spring: 'devicon-spring-plain colored',
  nestjs: 'devicon-nestjs-plain colored',
  graphql: 'devicon-graphql-plain colored',

  // Languages
  nodejs: 'devicon-nodejs-plain colored',
  node: 'devicon-nodejs-plain colored',
  javascript: 'devicon-javascript-plain colored',
  typescript: 'devicon-typescript-plain colored',
  python: 'devicon-python-plain colored',
  go: 'devicon-go-plain colored',
  golang: 'devicon-go-plain colored',
  rust: 'devicon-rust-plain',
  java: 'devicon-java-plain colored',
  csharp: 'devicon-csharp-plain colored',
  php: 'devicon-php-plain colored',
  ruby: 'devicon-ruby-plain colored',
  swift: 'devicon-swift-plain colored',
  kotlin: 'devicon-kotlin-plain colored',
  scala: 'devicon-scala-plain colored',
  elixir: 'devicon-elixir-plain colored',
  haskell: 'devicon-haskell-plain colored',
  clojure: 'devicon-clojure-plain colored',

  // Infrastructure
  nginx: 'devicon-nginx-original colored',
  apache: 'devicon-apache-plain colored',
  terraform: 'devicon-terraform-plain colored',
  ansible: 'devicon-ansible-plain colored',
  vagrant: 'devicon-vagrant-plain colored',
  prometheus: 'devicon-prometheus-original colored',
  grafana: 'devicon-grafana-original colored',

  // CI/CD
  jenkins: 'devicon-jenkins-plain colored',
  circleci: 'devicon-circleci-plain colored',
  githubactions: 'devicon-githubactions-plain colored',
  travis: 'devicon-travis-plain colored',
  argocd: 'devicon-argocd-plain colored',

  // Message Queues
  kafka: 'devicon-apachekafka-original colored',
  rabbitmq: 'devicon-rabbitmq-original colored',

  // ORMs & Tools
  prisma: 'devicon-prisma-original',
  sequelize: 'devicon-sequelize-plain colored',
  webpack: 'devicon-webpack-plain colored',
  vite: 'devicon-vitejs-plain colored',
  babel: 'devicon-babel-plain colored',
  eslint: 'devicon-eslint-plain colored',

  // Testing
  jest: 'devicon-jest-plain colored',
  mocha: 'devicon-mocha-plain colored',
  pytest: 'devicon-pytest-plain colored',
  selenium: 'devicon-selenium-original colored',

  // Editors & Tools
  vscode: 'devicon-vscode-plain colored',
  vim: 'devicon-vim-plain colored',
  linux: 'devicon-linux-plain',
  ubuntu: 'devicon-ubuntu-plain colored',
  debian: 'devicon-debian-plain colored',

  // Mobile
  android: 'devicon-android-plain colored',
  apple: 'devicon-apple-original',
  flutter: 'devicon-flutter-plain colored',
  reactnative: 'devicon-react-original colored',

  // Misc
  npm: 'devicon-npm-original-wordmark colored',
  yarn: 'devicon-yarn-plain colored',
  bun: 'devicon-bun-plain colored',
  figma: 'devicon-figma-plain colored',
  sketch: 'devicon-sketch-line colored',
  slack: 'devicon-slack-plain colored',
  trello: 'devicon-trello-plain colored',
  jira: 'devicon-jira-plain colored',
  confluence: 'devicon-confluence-plain colored',
  notion: 'devicon-notion-plain',

  // AWS specific services
  ec2: 'devicon-amazonwebservices-plain-wordmark colored',
  s3: 'devicon-amazonwebservices-plain-wordmark colored',
  lambda: 'devicon-amazonwebservices-plain-wordmark colored',
  eks: 'devicon-amazonwebservices-plain-wordmark colored',
  rds: 'devicon-amazonwebservices-plain-wordmark colored',
};

interface BrandIconProps {
  name: string;
  size?: number;
  className?: string;
}

export function BrandIcon({ name, size = diagramTheme.spacing.iconSize, className }: BrandIconProps) {
  const iconClass = ICON_MAP[name.toLowerCase()];

  if (!iconClass) {
    // Fallback: simple database icon
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
        <ellipse cx="12" cy="6" rx="8" ry="3" fill="#666" />
        <path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6" stroke="#666" strokeWidth="2" fill="none" />
        <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" stroke="#666" strokeWidth="2" fill="none" />
      </svg>
    );
  }

  // Use foreignObject to embed HTML (devicon font) inside SVG
  return (
    <foreignObject width={size} height={size} className={className}>
      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <i
          className={iconClass}
          style={{
            fontSize: size * 0.9,
            lineHeight: 1,
          }}
        />
      </div>
    </foreignObject>
  );
}

export function getIconColor(name: string): string {
  return ICON_MAP[name.toLowerCase()] ? '#666' : '#666';
}

export function hasIcon(name: string): boolean {
  return name.toLowerCase() in ICON_MAP;
}
