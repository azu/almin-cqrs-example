import React from "react";
export interface LoadingProps {
    hidden: boolean
}
export default class Loading extends React.Component<LoadingProps, any> {
    render() {
        return <div className="Loading" hidden={this.props.hidden}></div>
    }
}