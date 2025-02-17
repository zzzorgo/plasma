import React from 'react';
import styled, { css } from 'styled-components';
import type { StyledComponent } from 'styled-components';
import { Body1, Footnote1, Headline1, Button, Carousel, CarouselItem, Headline2 } from '@salutejs/plasma-ui';
import { primary, secondary } from '@salutejs/plasma-tokens';
import { mediaQuery } from '@salutejs/plasma-ui/utils';

import { useFocusOnMount } from '../../hooks/useFocusOnMount';
import { DeviceFamily, GetStyledComponentProps } from '../../types';
import { deviceFamily } from '../../utils/deviceFamily';

type StyledComponentProps = GetStyledComponentProps<typeof Body1 | typeof Footnote1 | typeof Headline1>;
type StyledTextNode = StyledComponent<'div', any, StyledComponentProps, never>;

const StyledList = styled(Carousel)`
    box-sizing: border-box;

    width: 916px;
    max-height: 602px;
    padding: 0 1rem 60px;
    /* stylelint-disable */
    mask-image: linear-gradient(
        180deg,
        rgba(196, 196, 196, 0.25) 0%,
        rgba(196, 196, 196, 0.79) 37.25%,
        #c4c4c4 62.85%,
        rgba(196, 196, 196, 0.15) 107.29%
    );
    /* stylelint-enable */

    user-select: none;
    outline: none;
`;

export const AssistantActionConfirmWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    padding-top: 2rem;

    ${mediaQuery(
        'M',
        2,
    )(
        css`
            padding-top: 1rem;
        `,
    )}
`;

export const AssistantActionConfirmLabel: StyledTextNode = styled(Body1)`
    color: ${primary};
    margin-bottom: 8px;
`;

export const AssistantActionConfirmTitle: StyledTextNode = styled(Headline1)`
    color: ${primary};
    margin-bottom: 8px;
`;

export const AssistantActionConfirmDescription: StyledTextNode = styled(Footnote1)`
    margin-top: 2rem;
    color: ${secondary};
`;

interface AssistantActionConfirmResultsProps<T> {
    suggests: Array<T>;
    onConfirm: (value: T) => void;
    onReject?: () => void;
    labelFormatter?: (val: T) => string;
}

const mapDeviceToResult: Record<DeviceFamily, React.FC> = {
    sberBox: Headline1,
    sberPortal: Headline2,
    mobile: Headline2,
};

export const AssistantActionConfirmResult = styled(mapDeviceToResult[deviceFamily])`
    text-transform: capitalize;
`;

const StyledControlsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    margin-top: 64px;
`;

const StyledButton = styled(Button)<{ wide?: boolean }>`
    ${({ wide }) => {
        if (wide) {
            return {
                marginTop: '24px',
                width: '816px',
            };
        }

        return {
            marginLeft: '32px',
            '&:first-child': { marginLeft: 0 },
        };
    }}
    justify-content: center;
`;

interface AssistantActionConfirmControlsProps<T> extends AssistantActionConfirmResultsProps<T> {
    confirmText?: string;
    rejectText?: string;
    confirmDisable?: boolean;
}

export function AssistantActionConfirmControls<T>({
    suggests,
    onConfirm,
    onReject,
    confirmText = 'Да, всё верно',
    rejectText = 'Нет, ввести другой',
    confirmDisable,
}: Exclude<AssistantActionConfirmControlsProps<T>, 'canRejected'>) {
    const mountRef = React.useRef<HTMLButtonElement>(null);

    useFocusOnMount<HTMLButtonElement>(mountRef, {
        delay: 250,
    });

    return (
        <StyledControlsWrapper>
            <StyledButton
                disabled={confirmDisable}
                view="primary"
                size="s"
                onClick={() => onConfirm(suggests[0])}
                ref={!confirmDisable ? mountRef : null}
            >
                {confirmText}
            </StyledButton>
            <StyledButton view="secondary" size="s" onClick={onReject} ref={!confirmDisable ? null : mountRef}>
                {rejectText}
            </StyledButton>
        </StyledControlsWrapper>
    );
}

const StyledItem = styled(CarouselItem)`
    display: inline-flex;
`;

const SelectItem: React.FC = ({ children, ...props }) => {
    return <StyledItem {...props}>{children}</StyledItem>;
};

export function AssistantActionConfirmResults<T>({
    suggests,
    onConfirm,
    onReject,
    labelFormatter,
}: AssistantActionConfirmResultsProps<T>) {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const mountRef = React.useRef<HTMLButtonElement>(null);

    const itemsToRender = React.useMemo(() => {
        const list = suggests.map((item) => ({
            label: labelFormatter?.(item) ?? String(item),
            onClick: () => onConfirm(item),
        }));

        if (typeof onReject === 'function') {
            list.push({
                label: 'Ничего не подходит',
                onClick: onReject,
            });
        }

        return list;
    }, [suggests, onConfirm, onReject, labelFormatter]);

    useFocusOnMount<HTMLButtonElement>(mountRef, {
        delay: 250,
    });

    return (
        <StyledList axis="y" index={selectedIndex}>
            {itemsToRender.map((item, index) => (
                <SelectItem>
                    <StyledButton
                        key={item.label}
                        wide
                        view="secondary"
                        size="l"
                        onClick={item.onClick}
                        onFocus={() => setSelectedIndex(index)}
                        ref={mountRef.current ? null : mountRef}
                    >
                        {item.label}
                    </StyledButton>
                </SelectItem>
            ))}
        </StyledList>
    );
}
