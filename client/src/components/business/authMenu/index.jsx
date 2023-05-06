import React, {Component} from "react";
import intl from 'react-intl-universal';
import {Menu, Dropdown,Button, Select, Input} from "antd";
import {Link} from 'react-router-dom';
import Icon from 'components/widgets/icon';
import authComponent from "utils/authComponent";
import authAmountComponent from "utils/authAmountComponent";
import Tooltip from 'components/widgets/tooltip';

class BaseMenu extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let liItemStr;
        let { tipFlag, tipTitle} = this.props;

        if (this.props.clickHandler) {
            liItemStr = <a ga-data={'list-' + this.props.option} onClick={this.props.clickHandler} disabled={this.props.disabled}>{this.props.icon &&
            <Icon type={this.props.icon}/>}{this.props.label}</a>
        } else if (this.props.to) {
            liItemStr = <Link ga-data={'list-' + this.props.option} to={this.props.to} disabled={this.props.disabled}>{this.props.icon &&
            <Icon type={this.props.icon}/>}{this.props.label}</Link>
        } else if (this.props.href) {
            liItemStr = <a ga-data={'list-' + this.props.option} href={this.props.href} disabled={this.props.disabled}>{this.props.icon &&
            <Icon type={this.props.icon}/>}{this.props.label}</a>
        }

        return (
            <React.Fragment>
                {
                    this.props.disabled?null:(
                        <li style={this.props.style} className={this.props.className || "ant-dropdown-menu-item"} role="menuitem">
                            {
                                tipFlag ?  (
                                    <Tooltip title={tipTitle}>
                            <span>
                                {liItemStr}
                            </span>
                                    </Tooltip>
                                ) : (
                                    <>
                                        {liItemStr}
                                    </>
                                )
                            }
                        </li>
                    )
                }
            </React.Fragment>
        );
    }
};

const BaseAuthMenu = authComponent(authAmountComponent(BaseMenu));

class BaseButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            to, clickHandler, dispatch, iconTheme,addMenu,
            ...otherProps
        } = this.props;


        if(addMenu){
            return(
                <Dropdown overlay={addMenu} placement="bottomCenter">
                    <Button type={this.props.type} ga-data={this.props['ga-data']} icon={<Icon type={this.props.icon}/>} className={this.props.className}>
                        {this.props.label}
                    </Button>
                </Dropdown>
            )
        }else{
            if (clickHandler) {
                return (<Button onClick={clickHandler} {...otherProps} icon={this.props.icon && (this.props.icon != 'plus') && <Icon type={this.props.icon} theme={iconTheme}/>}>
                        {this.props.label}
                    </Button>
                );
            } else if (to) {

                return (
                    <Link to={to}>
                        <Button type={this.props.type} ga-data={this.props['ga-data']} icon={<Icon type={this.props.icon}/>} className={this.props.className}>
                            {this.props.label}
                        </Button>
                    </Link>
                );
            } else {
                return <Button type={this.props.type} ga-data={this.props['ga-data']} icon={<Icon type={this.props.icon}/>}>{this.props.label}</Button>
            }
        }


    }
};

const BaseAuthButton = authComponent(authAmountComponent(BaseButton));

const AddButton = ({...props}) => {
    return (
        <BaseAuthButton {...props} label={props.label || intl.get("components.authMenu.index.add")} option={"add"}/>
    );
};
const DeleteButton = ({...props}) => {
    return (
        <BaseAuthButton label={intl.get("components.authMenu.index.delete")} {...props} option={"delete"}/>
    );
};

const WareEnterButton = ({...props}) => {
    return (
        <BaseAuthButton label={intl.get("components.authMenu.index.inbound")} option={"add"} module={'inbound'} {...props} />
    );
};

const WareOutButton = ({...props}) => {
    return (
        <BaseAuthButton label={intl.get("components.authMenu.index.outbound")} module={'outbound'} option={"add"}  {...props} />
    );
};

const IncomeButton = ({...props}) => {
    return (
        <BaseAuthButton label={intl.get("components.authMenu.index.income")} module={'income'} option={"add"} {...props}/>
    );
};

const ExpandButton = ({...props}) => {
    return (
        <BaseAuthButton label={intl.get("components.authMenu.index.expend")} module={'expend'} option={"add"} {...props}/>
    );
};

const InvoiceButton = ({...props}) => {
    return (
        <BaseAuthButton label={intl.get("components.authMenu.index.invoice")} module={'invoice'} option={"add"} {...props}/>
    );
};

const SaleInvoiceButton = ({...props}) => {
    return (
        <BaseAuthButton  label={intl.get("components.authMenu.index.saleInvoice")} module={'saleInvoice'} option={"add"} {...props}/>
    );
};

const ApproveButton = ({...props}) => {
    return (
        <BaseAuthButton  label={intl.get("components.authMenu.index.approve")} option={"approve"} {...props}/>
    );
};

const UnApproveButton = ({...props}) => {
    return (
        <BaseAuthButton  label={intl.get("components.authMenu.index.unApprove")}  option={"approve"} {...props}/>
    );
};

const CopyMenu = ({...props}) => {
    return (
        <BaseAuthMenu  label={intl.get("components.authMenu.index.copy")} {...props} option={"add"} gaOption={'copy'}/>
    );
};

const ModifyMenu = ({...props}) => {
    return (
        <BaseAuthMenu  label={intl.get("components.authMenu.index.modify")} {...props} option={"modify"}/>
    );
};

const DeleteMenu = ({...props}) => {
    return (
        <BaseAuthMenu  label={intl.get("components.authMenu.index.delete")} {...props} option={"delete"}/>
    );
};

const PurchaseMenu = ({...props}) => {
    return (
        <BaseAuthMenu  label={"采购"} {...props} option={"purchase"}/>
    );
};

const OutWareMenu = ({...props}) => {
    return (
        <BaseAuthMenu  label={"出库"} {...props} option={"purchase"}/>
    );
};

const CommonItemMenu = ({...props}) => {
    return (
        <BaseAuthMenu {...props}/>
    );
};

const DispatchMenu = ({...props}) => {
    return (
        <BaseAuthMenu label={intl.get("components.authMenu.index.assignAccount")} {...props} option={"main"}/>
    );
};
const ToggleVisibleMenu = ({...props}) => {
    return (
        <BaseAuthMenu label={intl.get("components.authMenu.index.toggleHidden")} {...props} option={"modify"} gaOption={'display-toggle'}/>
    );
};


class BaseInput extends Component {

    static getDerivedStateFromProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            return {
                value: nextProps.value
            };
        }
        return null;
    }

    constructor(props) {
        super(props);

        const value = props.value || '';

        this.state = {
            value
        };
    }


    handleChange = (value) => {

        if (!('value' in this.props)) {
            this.setState({
                value
            });
        }

        const onChange = this.props.onChange;
        if (onChange) {
            onChange(value);
        }
    };


    render() {
        return (
            <Input
                maxLength={this.props.maxLength}
                value={this.state.value}
                disabled={this.props.disabled}
                onChange={this.props.onChange}
                placeholder={this.props.placeholder}
                style={this.props.style}
                className={this.props.className}
                readOnly={this.props.readOnly}
            />
        )
    }
}

const AuthInput = authComponent(BaseInput);

// 一键转化为自己的物品按钮
class BaseConvertButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {style, loadingFlag, clickHandler, title} = this.props;
        return (
            <Button style={style}
                    loading={loadingFlag}
                    onClick={clickHandler}>
                {title}
            </Button>
        )
    }
};

const ConvertButton = authAmountComponent(BaseConvertButton);

export {
    AddButton,
    DeleteButton,
    WareEnterButton,
    WareOutButton,
    IncomeButton,
    ExpandButton,
    InvoiceButton,
    SaleInvoiceButton,
    ApproveButton,
    UnApproveButton,
    ConvertButton,
    CopyMenu,
    ModifyMenu,
    DeleteMenu,
    CommonItemMenu,
    DispatchMenu,
    ToggleVisibleMenu,
    AuthInput,
    PurchaseMenu,
    OutWareMenu

};
