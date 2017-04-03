// LICENSE : MIT
"use strict";
import React from "react";
import Counter from './Counter';
import Loading from './Loading/Loading';
import { AppStoreGroupState } from "../store/AppStoreGroup";                                                                                                                                                         
export class App extends React.Component<AppStoreGroupState, {}> {
    render() {
        const counterState = this.props.counterState;
        return <div>
            <Counter count={counterState.count} history={counterState.history} />
            <Loading hidden={!this.props.appState.isLoading} />
        </div>
    }
}