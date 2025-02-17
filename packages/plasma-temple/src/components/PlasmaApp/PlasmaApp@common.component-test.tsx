import React from 'react';
import { Button } from '@salutejs/plasma-ui';

import { startApp, sendAction } from '../../testHelpers/testRenderHelpers';
import { Header } from '../Header/Header';
import { PageComponent } from '../Page/types';

interface State {
    page1: null;
    page2: {
        text: string;
    };
    page3: null;
}

describe('PlasmaApp', () => {
    beforeEach(() => {
        startApp<keyof State, State>(
            [
                {
                    name: 'page1',
                    component: ({ pushScreen }) => {
                        return (
                            <>
                                <Header title="Page 1" />
                                <Button onClick={() => pushScreen('page2')} data-cy="open-second">
                                    Open Next Page
                                </Button>
                            </>
                        );
                    },
                    lazy: true,
                },
                {
                    name: 'page2',
                    component: ({ state, popScreen, pushScreen }) => {
                        return (
                            <>
                                <Header title="Page 2" />
                                <p>{state.text}</p>
                                <Button onClick={popScreen} data-cy="go-back">
                                    Open Prev Page
                                </Button>
                                <Button onClick={() => pushScreen('page3')} data-cy="go-next">
                                    Open Next Page
                                </Button>
                            </>
                        );
                    },
                    lazy: true,
                    getInitialProps: () => {
                        return {
                            text: 'Data from `getInitialProps`',
                        };
                    },
                },
                {
                    name: 'page3',
                    component: ({ goToScreen, popScreen }) => {
                        return (
                            <>
                                <Header title="Page 3" />
                                <Button onClick={popScreen} data-cy="go-back">
                                    Open Next Page
                                </Button>
                                <Button onClick={() => goToScreen('page1')} data-cy="go-to-first" focused>
                                    Open First Page
                                </Button>
                            </>
                        );
                    },
                },
            ],
            ({ pushScreen }) => {
                pushScreen('page1');
            },
        );
    });

    afterEach(() => {
        cy.matchImageSnapshot();
    });

    it('render first screen', () => {
        cy.get('button[data-cy="open-second"]').should('contain.text', 'Open Next Page');
    });

    it('navigate to next screen', () => {
        cy.get('[data-cy="open-second"]').focus();

        cy.focused().click({ scrollBehavior: false });
    });

    it('back to first screen', () => {
        cy.get('[data-cy="open-second"]').focus();
        cy.focused().click({ scrollBehavior: false });

        cy.get('[data-cy="go-back"]').focus();
        cy.focused().click({ scrollBehavior: false });
    });

    it('runtime switch character', () => {
        sendAction({
            type: 'character',
            character: {
                id: 'joy',
                gender: 'female',
                name: 'Джой',
                appeal: 'no_official',
            },
        });

        cy.get('[data-cy="open-second"]').focus();
        cy.focused().click({ scrollBehavior: false });

        cy.get('[data-cy="go-next"]').focus();
        cy.focused().click({ scrollBehavior: false });

        cy.get('[data-cy="go-to-first"]').click({ scrollBehavior: false });
    });

    it('reaction on state action -- pushHistory', () => {
        sendAction({
            type: 'smart_app_data',
            // eslint-disable-next-line @typescript-eslint/camelcase
            smart_app_data: {
                type: 'pushHistory',
                payload: {
                    history: {
                        name: 'page2',
                        data: {
                            text: 'Data from assistantCommand',
                        },
                    },
                },
            },
        });

        cy.get('p').should('contain.text', 'Data from assistantCommand');
    });

    it('reaction on state action -- popHistory', () => {
        sendAction({
            type: 'smart_app_data',
            // eslint-disable-next-line @typescript-eslint/camelcase
            smart_app_data: {
                type: 'pushHistory',
                payload: {
                    history: {
                        name: 'page2',
                        data: {
                            text: 'Data from assistantCommand',
                        },
                    },
                },
            },
        });

        sendAction({
            type: 'smart_app_data',
            // eslint-disable-next-line @typescript-eslint/camelcase
            smart_app_data: {
                type: 'popHistory',
            },
        });

        cy.get('button[data-cy="open-second"]').should('contain.text', 'Open Next Page');
    });

    it('no reaction on unexpected action', () => {
        cy.get('button[data-cy="open-second"]').should('contain.text', 'Open Next Page');

        sendAction({
            type: 'smart_app_data',
            // eslint-disable-next-line @typescript-eslint/camelcase
            smart_app_data: {
                type: 'customAction',
                payload: {
                    custom: 'value',
                },
            },
        });

        cy.get('button[data-cy="open-second"]').should('contain.text', 'Open Next Page');
    });
});

describe('Page.getInitialProps', () => {
    const Component: PageComponent<any, any> = ({ state }) => (
        <>
            <Header title="Page 1" />
            <p>{state.text}</p>
        </>
    );

    it('sync - as standalone function', () => {
        startApp(
            [
                {
                    name: 'page1',
                    component: Component,
                    getInitialProps: ({ params, character }) => {
                        expect(character).to.equal('sber');
                        expect(params).not.be.undefined;
                        expect(params).have.key('name');

                        return {
                            text: '`getIntialProps` as standlone fn',
                        };
                    },
                    lazy: true,
                },
            ],
            ({ pushScreen }) => {
                pushScreen('page1', {
                    name: 'page1',
                });
            },
        );
    });

    it('async - as standalone function', () => {
        startApp(
            [
                {
                    name: 'page1',
                    component: Component,
                    getInitialProps: ({ params, character }) => {
                        expect(character).to.equal('sber');
                        expect(params).not.be.undefined;
                        expect(params).have.key('name');

                        return Promise.resolve({
                            text: '`getIntialProps` as standlone fn',
                        });
                    },
                    lazy: true,
                },
            ],
            ({ pushScreen }) => {
                pushScreen('page1', {
                    name: 'page1',
                });
            },
        );
    });

    it('sync - as component function prop', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore чет для этого типов нет, но так работает
        Component.getInitialProps = ({ params, character }) => {
            expect(character).to.equal('sber');
            expect(params).not.be.undefined;
            expect(params).have.key('name');

            return {
                text: '`getIntialProps` as component fn prop',
            };
        };

        startApp(
            [
                {
                    name: 'page1',
                    component: Component,
                    lazy: true,
                },
            ],
            ({ pushScreen }) => {
                pushScreen('page1', {
                    name: 'page1',
                });
            },
        );
    });

    it('async - as component function prop', () => {
        const Component: PageComponent<any, any> = ({ state }) => (
            <>
                <Header title="Page 1" />
                <p>{state.text}</p>
            </>
        );

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore чет для этого типов нет, но так работает
        Component.getInitialProps = ({ params, character }) => {
            expect(character).to.equal('sber');
            expect(params).not.be.undefined;
            expect(params).have.key('name');

            return Promise.resolve({
                text: '`getIntialProps` as component fn prop',
            });
        };

        startApp(
            [
                {
                    name: 'page1',
                    component: Component,
                    lazy: true,
                },
            ],
            ({ pushScreen }) => {
                pushScreen('page1', {
                    name: 'page1',
                });
            },
        );
    });
});
