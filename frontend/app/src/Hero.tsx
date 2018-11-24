import * as React from "react";
import {Page} from "./Page";
import * as qs from "query-string";

export function Hero() {
    const {
        pull_request_id,
        amount,
        dev
    } = qs.parse(location.search);

    console.log(`pull_request_id: ${pull_request_id}, amount: ${amount}, dev: ${dev}`);
    console.log(`Card: 5106 2110 0269 3658 - CVC:720 01/2019`);

    if (!Boolean(dev)) {
        window.history.replaceState(history.state, window.document.title, "/");
    }

    // open fackyoupayme.com?issue_id?amount
    // make request for PR description
    // show card form
    // on submit make request, and show "ok" icon with link back to PR

    return (
        <section className="hero is-fullheight">
            <div className="hero-body">
                <div className="container">
                    <div className="columns">
                        <div className="column is-4 is-offset-4">
                            <Page/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
