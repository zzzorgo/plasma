import { useCallback } from 'react';
import { isSberPortal } from '@salutejs/plasma-ui/utils';
import { AssistantNavigationCommand } from '@salutejs/client';

import { Axis } from '../types';

import { useAssistantOnNavigation } from './useAssistantOnNavigation';

const defaultStepSize = isSberPortal() ? 3 : 4;

interface UseGalleryVoiceNavigationProps {
    index: number;
    setIndex: (value: number) => void;
    axis: Axis;
    maxIndex: number;
    minIndex?: number;
    stepSize?: number;
    disabled?: boolean;
    main?: boolean;
}

// @deprecated works only with PlasmaApp
export const useVoiceNavigation = ({
    index,
    setIndex,
    minIndex = 0,
    maxIndex,
    stepSize = defaultStepSize,
    disabled,
    axis,
    main,
}: UseGalleryVoiceNavigationProps): void => {
    const onNavigate = useCallback(
        (command: AssistantNavigationCommand) => {
            if (disabled) {
                return;
            }

            const direction = command.navigation.command;

            const isNext = axis === 'x' ? direction === 'RIGHT' : direction === 'DOWN';
            const isPrevious = axis === 'x' ? direction === 'LEFT' : direction === 'UP';

            if (isNext || (main && direction === 'FORWARD')) {
                setIndex(maxIndex ? Math.min(maxIndex, index + stepSize) : index + stepSize);
            } else if (isPrevious) {
                setIndex(Math.max(minIndex, index - stepSize));
            }
        },
        [axis, disabled, index, maxIndex, minIndex, setIndex, stepSize, main],
    );
    useAssistantOnNavigation(onNavigate);
};

export const useVoiceNavigationWithSpatNav = ({ axis, main }: { axis: Axis; main?: boolean }): void => {
    const onNavigate = useCallback(
        (command: AssistantNavigationCommand) => {
            const direction = command.navigation.command;

            if (axis === 'x') {
                switch (direction) {
                    case 'LEFT':
                        window.navigate('left');
                        break;
                    case 'RIGHT':
                        window.navigate('right');
                        break;
                    case 'FORWARD': {
                        if (main) {
                            window.navigate('right');
                        }
                        break;
                    }
                    default:
                }
            } else {
                switch (direction) {
                    case 'DOWN':
                        window.navigate('down');
                        break;
                    case 'UP':
                        window.navigate('up');
                        break;
                    case 'FORWARD': {
                        if (main) {
                            window.navigate('down');
                        }
                        break;
                    }
                    default:
                }
            }
        },
        [axis, main],
    );

    useAssistantOnNavigation(onNavigate);
};
