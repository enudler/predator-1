import React, { Fragment } from 'react';
import _ from 'lodash';
import style from './style.scss';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import { connect } from 'react-redux';
import {processingUpdateConfig, errorOnUpdateConfig, config} from '../../instance/redux/selectors/configSelector';
import * as Actions from '../../instance/redux/action';
import Loader from '../Loader';
import InputList from '../InputList';
import ErrorDialog from '../ErrorDialog';
import classNames from 'classnames';
import TooltipWrapper from '../../../../components/TooltipWrapper';
import RactangleAlignChildrenLeft from '../../../../components/RectangleAlign/RectangleAlignChildrenLeft';

const inputTypes = {
    INPUT_LIST: 'INPUT_LIST',
    CHECKBOX: 'CHECKBOX',
    TEXT_FIELD: 'TEXT_FIELD'
};

class Form extends React.Component {
    constructor (props) {
        super(props);
        this.state = {};
        this.FormList = [
            {
                width: 350,
                name: 'internal_address',
                key: 'internal_address',
                floatingLabelText: 'Internal address',
                info: 'The local ip address of your machine'
            },
            {
                width: 350,
                name: 'docker_name',
                key: 'docker_name',
                floatingLabelText: 'Docker image name',
                info: 'The predator-runner docker image that will run the test',
            },
            {
                width: 350,
                name: 'runner_cpu',
                key: 'runner_cpu',
                floatingLabelText: 'Runner CPU',
                info: 'The predator-runner docker image that will run the test'
            },
            {
                width: 350,
                name: 'runner_memory',
                key: 'runner_memory',
                floatingLabelText: 'Runner memory (MB)',
                info: 'Max memory to use by each deployed runner'
            },
            {
                width: 350,
                name: 'minimum_wait_for_delayed_report_status_update_in_ms',
                key: 'minimum_wait_for_delayed_report_status_update_in_ms',
                floatingLabelText: 'Minimum delayed time for report update',
                info: 'The minimum of time waiting for runner to report before the test considered as finished in milliseconds'
            },
            {
                width: 350,
                name: 'default_email_address',
                key: 'default_email_address',
                floatingLabelText: 'Default email address',
                info: 'Default email to send final report to',
                defaultValue: '1'
            },
            {
                width: 350,
                name: 'default_webhook_url',
                key: 'default_webhook_url',
                floatingLabelText: 'Default webhook url',
                info: 'Default webhook url to send live report statistics to',
                defaultValue: '500'
            },
            {
                width: 350,
                name: 'grafana_url',
                key: 'grafana_url',
                floatingLabelText: 'Grafana url',
                info: 'Add notes about the test.',
            },
            {
                width: 350,
                name: 'metrics_plugin_name',
                key: 'metrics_plugin_name',
                label: 'Metrics plugin name',
                info: 'Metrics plugin to use (prometheus, influx)',
            },
            {
                width: 350,
                name: 'run_immediately',
                key: 'run_immediately',
                label: 'Run immediately',
                info: 'Schedule a one time job, which will run the test now.',
            },
            {
                width: 350,
                name: 'run_immediately',
                key: 'run_immediately',
                label: 'Run immediately',
                info: 'Schedule a one time job, which will run the test now.',
            },
            {
                width: 350,
                name: 'run_immediately',
                key: 'run_immediately',
                label: 'Run immediately',
                info: 'Schedule a one time job, which will run the test now.',
            },
            {
                width: 350,
                name: 'run_immediately',
                key: 'run_immediately',
                label: 'Run immediately',
                info: 'Schedule a one time job, which will run the test now.',
            },
            {
                width: 350,
                name: 'run_immediately',
                key: 'run_immediately',
                label: 'Run immediately',
                info: 'Schedule a one time job, which will run the test now.',
            },
            {
                width: 350,
                name: 'run_immediately',
                key: 'run_immediately',
                label: 'Run immediately',
                info: 'Schedule a one time job, which will run the test now.',
            },
            {
                width: 350,
                name: 'run_immediately',
                key: 'run_immediately',
                label: 'Run immediately',
                info: 'Schedule a one time job, which will run the test now.',
            },
        ];


        // prometheus_metrics_push_gateway_url: 'Url of push gateway',
        //     prometheus_metrics_bucket_sizes: 'Bucket sizes use to configure prometheus',
        //     influx_metrics_host: 'Host IP',
        //     influx_metrics_username: 'Username',
        //     influx_metrics_password: 'Password',
        //     smtp_server_host: 'Host IP',
        //     smtp_server_port: 'Port number',
        //     smtp_server_username: 'Username',
        //     smtp_server_password: 'Password',
        //     smtp_server_database: 'Influx db name',
        //     smtp_server_from: 'The \'from\' email address that will be used to send emails',
        //     smtp_server_timeout: 'Timout to SMTP server in milliseconds'
        //

        this.state['errors'] = {
            name: undefined,
            retries: undefined,
            uris: undefined,
            upstream_url: undefined,
            upstream_send_timeout: undefined,
            upstream_read_timeout: undefined,
            upstream_connect_timeout: undefined
        };
    }

    handleChangeForCheckBox = (name, evt) => {
        const newState = Object.assign({}, this.state, { [name]: evt.target.checked });
        // newState.errors = validate(newState);
        this.setState(newState);
    };

    onChangeFreeText = (name, evt) => {
        const newState = Object.assign({}, this.state, { [name]: evt.target.value });
        // newState.errors = validate(newState);
        this.setState(newState);
    };

    handleInputListAdd = (target, newElement) => {
        this.setState({
            [target]: [...this.state[target], newElement]
        });
    };

    closeViewErrorDialog = () => {
        this.props.clearErrorOnUpdateConfig();
    };

    showValue (value, configDetails, field) {
        let configField = (configDetails ? configDetails[field] : undefined);
        return this.props.serverError ? configField : value || '';
    }

    isThereErrorOnForm () {
        let state = this.state;

        return (Object.values(state.errors).find((oneError) => {
            return oneError !== undefined;
        }));
    }

    handleChangeForDropDown (name, evt, value) {
        this.setState({
            environment: evt.target.value
        });
    }

    showInfo (item) {
        const helpClass = classNames('material-icons');
        return <TooltipWrapper
            content={
                <div>
                    {item.info}
                </div>}
            dataId={`tooltipKey_${item.key}`}
            place='top'
            offset={{ top: 1 }}
        >
            <div data-tip data-for={`tooltipKey_${item.info}`} style={{ cursor: 'pointer' }}>
                <i style={{ color: '#CCCCCC' }} className={helpClass}>help_outline</i>
            </div>

        </TooltipWrapper>;
    }

    static getDerivedStateFromProps (nextProps, prevState) {

        const config = nextProps.config || {};
        let newState = {};

        Object.keys(prevState).forEach((key) => {
            if (prevState[key] !== config[key]) {
                newState[key] = prevState[key];
            } else {
                newState[key] = config[key];
            }
        });

        return newState;
    };


    render () {
        const configDetails = this.props.config;
        return (
            <div>
                <div className={style.form}>
                    {Object.keys(this.ConfigForm).map((title) => {
                        return this.generateSectionInput(title, configDetails);
                    })}

                    <div className={style.buttons}>
                        {this.props.processingAction && !this.props.serverError ? <Loader />
                            : <RaisedButton label='Submit' onClick={this.whenSubmit}
                                            primary
                                            disabled={!!this.isThereErrorOnForm()}
                            />}
                    </div>

                    {this.props.serverError ? <ErrorDialog showMessage={this.props.serverError}
                                                           closeDialog={this.closeViewErrorDialog} /> : null}
                </div>
            </div>

        );
    }

    generateInput = (oneItem, configDetails) => {
        switch (oneItem.type) {
            case inputTypes.CHECKBOX:
                return (
                    <Checkbox className={style.TextFieldAndCheckBoxToolTip}
                              style={{ width: oneItem.width, marginTop: '10px' }} key={oneItem.key}
                              disabled={oneItem.disabled}
                              errorText={this.state.errors[oneItem.name]}
                              onCheck={(evt) => { this.handleChangeForCheckBox(oneItem.name, evt) }}
                              label={oneItem.label}
                              name={oneItem.name}
                              value={false}
                    />
                );
            case inputTypes.INPUT_LIST:
                return (
                    <InputList
                        title={oneItem.floatingLabelText}
                        element={oneItem.element}
                        id={oneItem.key}
                        onChange={(evt) => this.handleInputListAdd(oneItem.name, evt)}
                        elements={this.state[oneItem.name]}
                    />
                );
            case inputTypes.TEXT_FIELD:
                return (
                    <TextField
                        className={style.TextFieldAndCheckBoxToolTip}
                        style={{ width: oneItem.width }}
                        id='standard-multiline-flexible'
                        key={oneItem.key}
                        value={oneItem.disabled ? configDetails && configDetails[oneItem.name] : this.showValue(this.state[oneItem.name], configDetails, oneItem.name)}
                        disabled={oneItem.disabled}
                        errorText={this.state.errors[oneItem.name]}
                        onChange={(evt) => this.onChangeFreeText(oneItem.name, evt)}
                        floatingLabelText={oneItem.floatingLabelText}
                        name={oneItem.name}
                        rows={2}
                        rowsMax={4}
                        multiLine
                    />
                );
            default:
                return (
                    <div>
                        <TextField
                            className={style.TextFieldAndCheckBoxToolTip}
                            style={{ width: oneItem.width }}
                            key={oneItem.key}
                            value={oneItem.disabled ? configDetails && configDetails[oneItem.name] : this.showValue(this.state[oneItem.name], configDetails, oneItem.name)}
                            disabled={oneItem.disabled}
                            errorText={this.state.errors[oneItem.name]}
                            onChange={(evt) => this.onChangeFreeText(oneItem.name, evt)}
                            floatingLabelText={oneItem.floatingLabelText}
                            name={oneItem.name} />
                    </div>
                );
        }
    };

    generateSectionInput = (title, configDetails) => {
        return (
            <fragment key={title}>
                <h2>{title}</h2>
                {this.ConfigForm[title].map((oneItem, index) => {
                    return (
                        <Fragment key={index}>
                            {!oneItem.hidden &&
                            <RactangleAlignChildrenLeft>
                                {this.generateInput(oneItem, configDetails)}
                                {this.showInfo(oneItem)}
                            </RactangleAlignChildrenLeft>}
                        </Fragment>
                    );
                }, this)}
            </fragment>
        )
    };

    whenSubmit = () => {
        let body = {};

        Object.keys(this.state).forEach((configKey) => {
            if (configKey !== 'errors') {
                if (this.props.configDataMap[configKey] && this.props.configDataMap[configKey].type === 'int') {
                    body[configKey] = parseInt(this.state[configKey]);
                } else {
                    body[configKey] = this.state[configKey];
                }
            }
        });

        for (let configSection in this.props.parsedConfig) {
            if (configSection !== 'General') {
                body[configSection] = {};
                Object.keys(body).forEach((bodyKey) => {
                    const configElement = this.props.parsedConfig[configSection].find((element) => element.name === bodyKey);
                    if (configElement) {
                        if (body[bodyKey] !== '') {
                            const value = configElement.type === 'int' ? parseInt(body[bodyKey]) : body[bodyKey];
                            if (value) {
                                const bodyKeyWithoutConfigSection = bodyKey.replace(`${configSection}_`, '');
                                body[configSection][bodyKeyWithoutConfigSection] = value;
                            }
                        }
                        delete body[bodyKey];
                    }
                });
            }
        }

        //delete empty values from config
        for(let key in body) {
            if (!_.isNumber(body[key]) && _.isEmpty(body[key])) {
                delete body[key];
                this.props.deleteConfigKey(key);
            }
        }

        body = JSON.parse(JSON.stringify(body));

        this.props.updateConfig(body);
        this.props.getConfig();
        this.props.history.push('/configuration');
    };
}

function mapStateToProps (state) {
    return {
        config: config(state),
        processingAction: processingUpdateConfig(state),
        serverError: errorOnUpdateConfig(state)
    };
}

const mapDispatchToProps = {
    clearErrorOnUpdateConfig: Actions.clearUpdateConfigError,
    updateConfig: Actions.updateConfig,
    deleteConfigKey: Actions.deleteConfigKey,
    getConfig: Actions.getConfig
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);
