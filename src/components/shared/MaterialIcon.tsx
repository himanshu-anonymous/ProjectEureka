import React from 'react';
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowRightOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ArrowUpIcon,
  ArrowUpRightIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ArrowsPointingOutIcon,
  ArrowsRightLeftIcon,
  ArchiveBoxIcon,
  Bars3BottomLeftIcon,
  Bars3Icon,
  BellIcon,
  BookOpenIcon,
  BuildingOffice2Icon,
  CalendarIcon,
  CameraIcon,
  ChartBarIcon,
  ChatBubbleBottomCenterTextIcon,
  ChatBubbleLeftEllipsisIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  CircleStackIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CpuChipIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  FaceSmileIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  KeyIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  MapIcon,
  MapPinIcon,
  NewspaperIcon,
  PaperAirplaneIcon,
  PauseIcon,
  PhoneIcon,
  PhotoIcon,
  PlayCircleIcon,
  PlayIcon,
  PlusIcon,
  ServerStackIcon,
  ShareIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  SignalIcon,
  SparklesIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  Squares2X2Icon,
  TvIcon,
  UserGroupIcon,
  UserIcon,
  VideoCameraIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';

export type MaterialIconName =
  | 'error'
  | 'warning'
  | 'arrow_downward'
  | 'arrow_back'
  | 'arrow_forward'
  | 'arrow_upward'
  | 'unfold_more'
  | 'north_east'
  | 'military_tech'
  | 'notifications'
  | 'menu_book'
  | 'domain'
  | 'calendar_today'
  | 'photo_camera'
  | 'check'
  | 'check_circle'
  | 'chevron_left'
  | 'chevron_right'
  | 'expand_more'
  | 'expand_less'
  | 'schedule'
  | 'download'
  | 'open_in_new'
  | 'visibility'
  | 'visibility_off'
  | 'bar_chart'
  | 'fact_check'
  | 'description'
  | 'inventory_2'
  | 'alt_route'
  | 'language'
  | 'history'
  | 'image'
  | 'vpn_key'
  | 'layers'
  | 'dashboard'
  | 'checklist'
  | 'progress_activity'
  | 'lock'
  | 'mail'
  | 'map'
  | 'location_on'
  | 'fullscreen'
  | 'menu'
  | 'chat_bubble'
  | 'speaker_notes'
  | 'newspaper'
  | 'pause'
  | 'call'
  | 'play_arrow'
  | 'play_circle'
  | 'add'
  | 'podcasts'
  | 'refresh'
  | 'sync'
  | 'search'
  | 'send'
  | 'dns'
  | 'share'
  | 'shield'
  | 'gpp_bad'
  | 'verified_user'
  | 'sentiment_satisfied'
  | 'auto_awesome'
  | 'trending_down'
  | 'trending_up'
  | 'tv'
  | 'cloud_upload'
  | 'person'
  | 'how_to_reg'
  | 'group'
  | 'videocam'
  | 'volume_up'
  | 'volume_off'
  | 'close'
  | 'logout'
  | 'menu_open'
  | 'mahagov'
  | 'emblem'
  | 'gov_emblem'
  | 'seal';

const ICON_MAP: Record<string, React.ComponentType<React.ComponentProps<'svg'>>> = {
  add: PlusIcon,
  alt_route: ArrowsRightLeftIcon,
  arrow_back: ArrowLeftIcon,
  arrow_downward: ArrowDownIcon,
  arrow_forward: ArrowRightIcon,
  arrow_upward: ArrowUpIcon,
  auto_awesome: SparklesIcon,
  bar_chart: ChartBarIcon,
  calendar_today: CalendarIcon,
  call: PhoneIcon,
  chat_bubble: ChatBubbleLeftEllipsisIcon,
  check: CheckIcon,
  check_circle: CheckCircleIcon,
  checklist: ClipboardDocumentCheckIcon,
  chevron_left: ChevronLeftIcon,
  chevron_right: ChevronRightIcon,
  close: XMarkIcon,
  cloud_upload: ArrowUpTrayIcon,
  dashboard: Squares2X2Icon,
  description: DocumentTextIcon,
  dns: ServerStackIcon,
  domain: BuildingOffice2Icon,
  download: ArrowDownTrayIcon,
  error: ExclamationCircleIcon,
  expand_more: ChevronDownIcon,
  expand_less: ChevronUpIcon,
  fact_check: ClipboardDocumentCheckIcon,
  fullscreen: ArrowsPointingOutIcon,
  gpp_bad: ShieldExclamationIcon,
  group: UserGroupIcon,
  history: ClockIcon,
  how_to_reg: ShieldCheckIcon,
  image: PhotoIcon,
  inventory_2: ArchiveBoxIcon,
  language: GlobeAltIcon,
  layers: CircleStackIcon,
  location_on: MapPinIcon,
  lock: LockClosedIcon,
  mail: EnvelopeIcon,
  map: MapIcon,
  menu_book: BookOpenIcon,
  military_tech: CpuChipIcon,
  newspaper: NewspaperIcon,
  north_east: ArrowUpRightIcon,
  notifications: BellIcon,
  open_in_new: ArrowTopRightOnSquareIcon,
  pause: PauseIcon,
  person: UserIcon,
  photo_camera: CameraIcon,
  play_arrow: PlayIcon,
  play_circle: PlayCircleIcon,
  podcasts: SignalIcon,
  progress_activity: ArrowPathIcon,
  refresh: ArrowPathIcon,
  schedule: ClockIcon,
  search: MagnifyingGlassIcon,
  send: PaperAirplaneIcon,
  share: ShareIcon,
  shield: ShieldCheckIcon,
  speaker_notes: ChatBubbleBottomCenterTextIcon,
  sync: ArrowPathIcon,
  trending_up: ArrowTrendingUpIcon,
  trending_down: ArrowTrendingDownIcon,
  tv: TvIcon,
  unfold_more: ChevronUpDownIcon,
  verified_user: ShieldCheckIcon,
  videocam: VideoCameraIcon,
  visibility: EyeIcon,
  visibility_off: EyeSlashIcon,
  volume_off: SpeakerXMarkIcon,
  volume_up: SpeakerWaveIcon,
  warning: ExclamationTriangleIcon,
  vpn_key: KeyIcon,
  logout: ArrowRightOnRectangleIcon,
  menu: Bars3Icon,
  menu_open: Bars3BottomLeftIcon,
  mahagov: ShieldCheckIcon,
  emblem: ShieldCheckIcon,
  gov_emblem: ShieldCheckIcon,
  seal: ShieldCheckIcon,
  sentiment_satisfied: FaceSmileIcon,
};

const sizeClasses: Record<string, string> = {
  xs: 'w-3.5 h-3.5',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

export interface MaterialIconProps extends React.SVGProps<SVGSVGElement> {
  name: MaterialIconName;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  label?: string;
  spin?: boolean;
  strokeWidth?: number;
}

/**
 * MaterialIcon - Unified 20px Solid Icon Adapter backed by official @heroicons/react/20/solid
 * Preserves Next.js tree-shaking with explicit named imports and safe InformationCircleIcon fallback.
 */
export const MaterialIcon: React.FC<MaterialIconProps> = ({
  name,
  size = 'md',
  className = '',
  label,
  spin = false,
  style,
  ...props
}) => {
  const IconComponent = ICON_MAP[name] || InformationCircleIcon;
  const sizeClass = typeof size === 'string' && sizeClasses[size] ? sizeClasses[size] : '';
  const inlineSize = typeof size === 'number' ? { width: size, height: size } : undefined;
  const spinClass = spin ? 'animate-spin' : '';
  const combinedClassName = `${sizeClass} shrink-0 ${spinClass} ${className}`.trim();

  return (
    <IconComponent
      className={combinedClassName}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      style={{ ...inlineSize, ...style }}
      {...props}
    />
  );
};

export default MaterialIcon;
