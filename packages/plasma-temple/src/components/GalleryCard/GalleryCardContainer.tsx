import React from 'react';
import { isSberBox } from '@salutejs/plasma-ui/utils';

import { GalleryCard as DefaultGalleryCard } from '../GalleryCard/GalleryCard';
import { AnyObject } from '../../types';

import { GalleryCardParams, GalleryCardProps } from './types';

export interface GalleryCardContainerProps<T extends AnyObject> extends Omit<GalleryCardProps<T>, 'onClick'> {
    component?: React.ComponentType<GalleryCardProps<T>>;
    onClick: (cardProps: GalleryCardParams<T>, index: number) => void;
}

export const GalleryCardContainer = <T extends AnyObject = AnyObject>({
    card,
    focused,
    index,
    tabIndex = -1,
    component,
    onClick,
    onFocus,
}: GalleryCardContainerProps<T>): React.ReactElement => {
    const GalleryCard = component ?? DefaultGalleryCard;

    const handleClick = React.useCallback(() => onClick(card, index), [card, index, onClick]);

    return (
        <GalleryCard
            card={card}
            focused={isSberBox() && focused}
            index={index}
            tabIndex={tabIndex}
            onClick={handleClick}
            onFocus={onFocus}
        />
    );
};
