import React, { useState } from 'react';
import { Story, Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { IconSleep, IconEye } from '@salutejs/plasma-icons';

import { disableProps } from '../../helpers';
import { InSpacing } from '../../helpers/StoryDecorators';
import { ActionButton } from '../Button';

import { TextField, TextFieldProps } from '.';

const propsToDisable = [
    'contentLeft',
    'htmlSize',
    '$isFocused',
    'contentRight',
    'type',
    'name',
    'onFocus',
    'onBlur',
    'onChange',
    'placeholder',
    'value',
    'checked',
    'maxLength',
    'minLength',
    'required',
];

const statusOptions = ['success', 'error', ''];

export default {
    title: 'Controls/TextField',
    component: TextField,
    decorators: [InSpacing],
    argTypes: {
        label: {
            control: {
                type: 'text',
            },
        },
        status: {
            control: {
                type: 'select',
                options: statusOptions,
            },
        },
        ...disableProps(propsToDisable),
    },
} as Meta;

export const Default: Story<TextFieldProps & { enableLeftIcon: boolean; enableRightIcon: boolean }> = ({
    status,
    enableLeftIcon,
    enableRightIcon,
    ...rest
}) => {
    const [value, setValue] = useState('Значение поля');

    return (
        <TextField
            value={value}
            status={status || undefined}
            contentLeft={enableLeftIcon && <IconSleep color="inherit" size="s" />}
            contentRight={
                enableRightIcon && (
                    <ActionButton view="clear">
                        <IconEye color="inherit" size="s" />
                    </ActionButton>
                )
            }
            onChange={(v) => setValue(v.target.value)}
            onFocus={action('onFocus')}
            onBlur={action('onBlur')}
            {...rest}
        />
    );
};

Default.args = {
    id: 'example-text-field',
    type: 'text',
    placeholder: 'Заполните поле',
    helperText: 'Подсказка к полю',
    disabled: false,
    readOnly: false,
    status: '' as 'success',
    size: 'l',
    enableLeftIcon: true,
    enableRightIcon: true,
};
