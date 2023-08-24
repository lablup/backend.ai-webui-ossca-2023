import React from "react";
import { Button, Dropdown, MenuProps } from "antd";
import {
  UserOutlined,
  MailOutlined,
  SecurityScanOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
  HolderOutlined,
  FileTextOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useSuspendedBackendaiClient } from "../hooks";
import { useTanQuery } from "../hooks/reactQueryAlias";
import { useTranslation } from "react-i18next";
import { useWebComponentInfo } from "./DefaultProviders";

const UserDropdownMenu: React.FC = () => {
  const { t } = useTranslation();

  const { dispatchEvent } = useWebComponentInfo();

  const baiClient = useSuspendedBackendaiClient();

  const { data: userInfo } = useTanQuery(
    "getUserRole",
    () => {
      return baiClient.user.get(baiClient.email, ["role"]);
    },
    {
      suspense: false,
    }
  );
  const userRole = userInfo?.user.role;

  const items: MenuProps["items"] = [
    {
      label: baiClient.full_name,
      key: "userFullName",
      icon: <UserOutlined />,
    },
    {
      label: baiClient.email,
      key: "userEmail",
      icon: <MailOutlined />,
    },
    {
      type: "divider",
    },
    {
      label: userRole,
      key: "userRole",
      icon: <SecurityScanOutlined />,
    },
    {
      type: "divider",
    },
    {
      label: t("webui.menu.AboutBackendAI"),
      key: "description",
      icon: <ExclamationCircleOutlined />,
      onClick: () => {
        const event: CustomEvent = new CustomEvent("backend-ai-show-splash");
        document.dispatchEvent(event);
      },
    },
    {
      label: t("webui.menu.MyAccount"),
      key: "userProfileSetting",
      icon: <LockOutlined />,
      onClick: () => {
        dispatchEvent("open", null);
      },
    },
    {
      label: t("webui.menu.Preferences"),
      key: "preferences",
      icon: <HolderOutlined />,
      onClick: () => {
        dispatchEvent("moveToUserSettingPage", null);
      },
    },
    {
      label: t("webui.menu.LogsErrors"),
      key: "logs",
      icon: <FileTextOutlined />,
      onClick: () => {
        dispatchEvent("moveToLogPage", null);
      },
    },
    {
      label: t("webui.menu.LogOut"),
      key: "logout",
      icon: <LogoutOutlined />,
      onClick: () => {
        const event: CustomEvent = new CustomEvent("backend-ai-logout");
        document.dispatchEvent(event);
      },
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <Button type="text" shape="circle">
        <UserOutlined style={{ fontSize: "20px" }} />
      </Button>
    </Dropdown>
  );
};

export default UserDropdownMenu;