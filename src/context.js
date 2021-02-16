import React from 'react';
import { ethers } from 'ethers';

const AppContext = React.createContext();

export class ContextProvider extends React.Component {
    state = {
        ctx: {
            address: null,
            netlifyToken: null,
            currentCollection: '0x0',
            collections: [
                /*
                * name -> string
                * symbol -> string
                * netlifyId -> string
                * netlifyState -> Map<file: string, hash: string>
                * tokensById -> Map<id: number, token: Object>
                * tokens -> Array<number>
                * events: 
                */
            ],
            ethers: {
                provider: null,
                signer: null,
            },
            alerts: [
                /*
                 * variant -> string
                 * content -> string
                 */
                {
                    variant: 'info',
                    content: 'Hello world!',
                },
                {
                    variant: 'danger',
                    content: 'Watch out!',
                },
            ]
        }
    }

    setCtx = ctx => this.setState(_ => ({ctx}));

    constructor (props) {
        super(props);
        
        if (window.ethereum) {
            this.state.ctx.ethers.provider = new ethers.providers.Web3Provider(window.ethereum);
        }
    }

    render() {
        const { ctx } = this.state
        const { setCtx } = this
    
        return (
          <AppContext.Provider
            value={{
              ctx,
              setCtx,
            }}
          >
            {this.props.children}
          </AppContext.Provider>
        )
    }
}
export const ContextConsumer = AppContext.Consumer;

export default AppContext;
