import * as React from "react";
import {Page} from "./Page";
import * as qs from "query-string";

export function Hero() {
    const {
        pull_request_id,
        repo,
        amount,
        choice,
        description,
        dev
    } = qs.parse(location.search);

    console.log(`Card: 5106 2110 0269 3658 - CVC:720 01/2019`);

    if (!Boolean(dev)) {
        window.history.replaceState(history.state, window.document.title, "/");
    }

    return (
        <section className="hero is-fullheight">
            <div className="hero-body">
                <div className="container">
                    <div className="columns">
                        <div className="fackform column is-4 is-offset-4">
                            <Page data={{
                                initialAmount: amount,
                                repo,
                                choice: choice === "true",
                                description,
                                pull_request_id
                            }}/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
