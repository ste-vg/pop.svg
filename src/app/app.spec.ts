import { expect } from 'chai';
import 'mocha';

import { App } from "./app";

describe('App', () =>     
{
    describe('exists', () =>     
    {
        it('should be not null', () => 
        {
            expect(App).to.not.be.null;
        });
    })
})