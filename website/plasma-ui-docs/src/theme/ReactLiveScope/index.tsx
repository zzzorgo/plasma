import React from 'react';
import { accent, primary, tertiary, critical } from '@salutejs/plasma-tokens';
import * as Icons from '@salutejs/plasma-icons';
import * as UI from '@salutejs/plasma-ui';
import { Filler } from '@salutejs/plasma-docs-ui';
import styled from 'styled-components';

// Add react-live imports you need here
const ReactLiveScope = {
    React,
    Filler,
    accent,
    primary,
    tertiary,
    critical,
    styled,
    ...Icons,
    ...UI,
    ...React,
};

export default ReactLiveScope;
