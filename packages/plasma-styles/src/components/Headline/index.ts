import styled from 'styled-components';
import { headline1, headline2, headline3, headline4 } from '@salutejs/plasma-tokens';

export const Headline1 = styled.div(headline1);
export const Headline2 = styled.div(headline2);
export const Headline3 = styled.div(headline3);
export const Headline4 = styled.div(headline4);

export const H1 = styled.h1({ margin: 0, ...headline1 });
export const H2 = styled.h2({ margin: 0, ...headline2 });
export const H3 = styled.h3({ margin: 0, ...headline3 });
export const H4 = styled.h3({ margin: 0, ...headline4 });
