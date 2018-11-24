import * as React from "react";
import Cards from "react-credit-cards";
import * as Payment from "payment";
import "react-credit-cards/lib/styles-compiled.css"
import "./css/form.css"

export class Page extends React.Component<{}, State> {
    constructor(props) {
        super(props);

        this.state = {
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
        console.log(type, isValid); //eslint-disable-line no-console
    }

    render(): React.ReactNode {
        const {
            name,
            number,
            expiry,
            cvc,
            focused
        } = this.state;

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
                    <div className="field is-horizontal">
                        <div className="field-body">
                            <div className="field">
                                <div className="control">
                                    <input className="input"
                                           type="tel"
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
                                    <button className="button is-fullwidth is-primary"
                                        onSubmit={() => {
                                            console.log("Submit");
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
    }
}

interface State {
    readonly name: string;
    readonly number: string;
    readonly expiry: string;
    readonly cvc: string;
    readonly focused: string;
}
