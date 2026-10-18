import React from 'react';
import { Symbol as HeroiconSymbol, SYMBOLS } from '@/symbols';

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

export interface MaterialIconProps extends React.SVGProps<SVGSVGElement> {
  name: MaterialIconName;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  label?: string;
  spin?: boolean;
  strokeWidth?: number;
}

/**
 * MaterialIcon - Inherits from Heroicons symbols.jsx with bold strokeWidth={2}
 */
export const MaterialIcon: React.FC<MaterialIconProps> = ({
  name,
  size = 'md',
  className = '',
  label,
  spin = false,
  strokeWidth = 2,
  style,
  ...props
}) => {
  return (
    <HeroiconSymbol
      name={name}
      size={size}
      className={className}
      spin={spin}
      strokeWidth={strokeWidth}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={style}
      {...props}
    />
  );
};

export default MaterialIcon;
