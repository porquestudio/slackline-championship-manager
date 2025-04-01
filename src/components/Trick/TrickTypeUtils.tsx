
import React from 'react';
import { Badge } from '@/components/ui/badge';

export type TrickType = 'technique' | 'height' | 'spin' | 'combo';

export const getTypeBadge = (type: string) => {
  switch (type) {
    case 'technique':
      return <Badge variant="outline" className="bg-slackline-blue bg-opacity-10 text-slackline-blue">Técnica</Badge>;
    case 'height':
      return <Badge variant="outline" className="bg-slackline-green bg-opacity-10 text-slackline-green">Altura</Badge>;
    case 'spin':
      return <Badge variant="outline" className="bg-slackline-yellow bg-opacity-10 text-slackline-yellow">Giro</Badge>;
    case 'combo':
      return <Badge variant="outline" className="bg-slackline-accent bg-opacity-10 text-slackline-accent">Combo</Badge>;
    default:
      return <Badge variant="outline">Outro</Badge>;
  }
};
