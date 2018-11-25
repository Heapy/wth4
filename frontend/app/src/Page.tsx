import * as React from "react";
import Cards from "react-credit-cards";
import * as Payment from "payment";
import "react-credit-cards/lib/styles-compiled.css"
import "./css/form.css"
import {pay} from "./Service";

export class Page extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            amount: Number(props.data.initialAmount),
            state: 1,
            loading: false,
            number: "",
            name: "",
            expiry: "",
            cvc: "",
            focused: "",
        };
    }

    componentDidMount() {
        Payment.formatCardNumber(document.querySelector('[name="number"]'));
        Payment.formatCardExpiry(document.querySelector('[name="expiry"]'));
        Payment.formatCardCVC(document.querySelector('[name="cvc"]'));
    }

    handleInputFocus = ({target}) => {
        this.setState({
            focused: target.name,
        });
    };

    handleInputChange = ({target}) => {
        if (target.name === 'number') {
            // @ts-ignore
            this.setState({
                [target.name]: target.value.replace(/ /g, ''),
            });
        } else if (target.name === 'expiry') {
            // @ts-ignore
            this.setState({
                [target.name]: target.value.replace(/ |\//g, ''),
            });
        } else {
            // @ts-ignore
            this.setState({
                [target.name]: target.value,
            });
        }
    };

    handleCallback(type, isValid) {
    }

    render(): React.ReactNode {
        const {
            data: {
                description,
                pull_request_id,
                repo,
                choice
            }
        } = this.props;

        const {
            amount,
            name,
            number,
            expiry,
            state,
            cvc,
            focused,
            loading
        } = this.state;


        if (state === 1) {
            return (
                <section>
                    <div className="content">
                        <h1 className="header is-1 has-text-centered">
                            Сколько ты зарабатываешь?
                        </h1>
                    </div>

                    <Cards
                        number={number}
                        name={name}
                        expiry={expiry}
                        cvc={cvc}
                        focused={focused}
                        callback={this.handleCallback}
                    />

                    <section className="section">
                        <div className="content is-medium has-text-centered">
                            You about to pay {amount}$ <b>{choice ? "for" : "against"}</b> pull
                            request <b>{description}</b>
                        </div>

                        <div className="field is-horizontal">
                            <div className="field-body">
                                <div className="field">
                                    <div className="control">
                                        <input className="input"
                                               value={amount}
                                               onChange={(el) => this.setState({
                                                   ...this.state,
                                                   amount: Number(el.target.value)
                                               })}
                                               min={1}
                                               type="number"
                                               name="amount"
                                               placeholder="Amount"
                                               onKeyUp={this.handleInputChange}
                                               onFocus={this.handleInputFocus}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="field is-horizontal">
                            <div className="field-body">
                                <div className="field">
                                    <div className="control">
                                        <input className="input"
                                               type="tel"
                                               name="number"
                                               placeholder="Card Number"
                                               onKeyUp={this.handleInputChange}
                                               onFocus={this.handleInputFocus}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="field is-horizontal">
                            <div className="field-body">
                                <div className="field">
                                    <div className="control">
                                        <input className="input"
                                               type="text"
                                               name="name"
                                               placeholder="Name"
                                               onKeyUp={this.handleInputChange}
                                               onFocus={this.handleInputFocus}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="field is-horizontal">
                            <div className="field-body">
                                <div className="field">
                                    <div className="control">
                                        <input className="input"
                                               type="tel"
                                               name="expiry"
                                               placeholder="Valid Thru"
                                               onKeyUp={this.handleInputChange}
                                               onFocus={this.handleInputFocus}
                                        />
                                    </div>
                                </div>
                                <div className="field">
                                    <div className="control">
                                        <input className="input"
                                               type="tel"
                                               name="cvc"
                                               placeholder="CVC"
                                               onKeyUp={this.handleInputChange}
                                               onFocus={this.handleInputFocus}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="field is-horizontal">
                            <div className="field-body">
                                <div className="field">
                                    <div className="control">
                                        <button
                                            className={"button is-fullwidth is-primary " + (loading ? "is-loading" : "")}
                                            onClick={() => {
                                                this.setState({
                                                    ...this.state,
                                                    loading: true
                                                });

                                                pay({
                                                    amount: Number(amount),
                                                    choice,
                                                    prId: Number(pull_request_id),
                                                    repository: repo
                                                }).then(a => {
                                                    this.setState({
                                                        ...this.state,
                                                        loading: false,
                                                        state: 2
                                                    });
                                                }, e => {
                                                    this.setState({
                                                        ...this.state,
                                                        loading: false,
                                                        state: 2
                                                    });
                                                })
                                            }}>
                                            Hack You Pay Me
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </section>
            );
        } else {
            return (
              <section className="section">
                  <nav className="level">
                      <p className="level-item has-text-centered">
                      </p>
                      <p className="level-item has-text-centered">
                      </p>
                      <p className="level-item has-text-centered">
                          <img className="image is-128x128" src={require("./img/success.png")}alt=""/>
                      </p>
                      <p className="level-item has-text-centered">
                      </p>
                      <p className="level-item has-text-centered">
                      </p>
                  </nav>
                  <div className="content has-text-centered is-large">
                      <h1 className="header is-2">Success</h1>
                      See <a href={`https://github.com/${repo}/pull/${pull_request_id}`}>pull request</a> on github.
                  </div>
              </section>
            );
        }
    }
}

interface Props {
    readonly data: {
        readonly repo: string;
        readonly choice: boolean;
        readonly description: string;
        readonly initialAmount: string;
        readonly pull_request_id: string;
    }
}

interface State {
    readonly loading: boolean;
    readonly state: number;
    readonly amount: number;
    readonly name: string;
    readonly number: string;
    readonly expiry: string;
    readonly cvc: string;
    readonly focused: string;
}
