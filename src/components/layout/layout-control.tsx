import { useTranslation } from "react-i18next";
import { Tooltip, Button, ButtonGroup } from "@mui/material";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import {
  CloseRounded,
  CropSquareRounded,
  FilterNoneRounded,
  HorizontalRuleRounded,
  PushPinOutlined,
  PushPinRounded,
  VisibilityOffOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";

import {
  entry_lightweight_mode,
} from "@/services/cmds";

const appWindow = getCurrentWebviewWindow();

export const LayoutControl = () => {
  const minWidth = 40;
  const { t } = useTranslation();
  const [isMaximized, setIsMaximized] = useState(false);
  const [isPined, setIsPined] = useState(false);

  useEffect(() => {
    const unlistenResized = appWindow.onResized(() => {
      appWindow.isMaximized().then((maximized) => {
        setIsMaximized(() => maximized);
      });
    });

    appWindow.isMaximized().then((maximized) => {
      setIsMaximized(() => maximized);
    });

    return () => {
      unlistenResized.then((fn) => fn());
    };
  }, []);

  return (
    <ButtonGroup
      variant="text"
      sx={{
        zIndex: 1000,
        height: "100%",
        ".MuiButtonGroup-grouped": {
          borderRadius: "0px",
          borderRight: "0px",
        },
      }}
    >
      <Button
        size="small"
        sx={{ minWidth, svg: { transform: "scale(0.9)" } }}
        onClick={() => {
          appWindow.setAlwaysOnTop(!isPined);
          setIsPined((isPined) => !isPined);
        }}
      >
        {isPined ? (
          <PushPinRounded fontSize="small" />
        ) : (
          <PushPinOutlined fontSize="small" />
        )}
      </Button>



    <Tooltip title={t("LightWeight Mode")} arrow>
      <Button
        size="small"
        sx={{ minWidth, svg: { transform: "scale(0.9)" } }}
        onClick={async () => await entry_lightweight_mode()}
        >
        <VisibilityOffOutlined fontSize="small" />
      </Button>
    </Tooltip>      

      <Button
        size="small"
        sx={{ minWidth, svg: { transform: "scale(0.9)" } }}
        onClick={() => appWindow.minimize()}
      >
        <HorizontalRuleRounded fontSize="small" />
      </Button>

      <Button
        size="small"
        sx={{ minWidth, svg: { transform: "scale(0.9)" } }}
        onClick={() => {
          setIsMaximized((isMaximized) => !isMaximized);
          appWindow.toggleMaximize();
        }}
      >
        {isMaximized ? (
          <FilterNoneRounded
            fontSize="small"
            style={{
              transform: "rotate(180deg) scale(0.7)",
            }}
          />
        ) : (
          <CropSquareRounded fontSize="small" />
        )}
      </Button>

      <Button
        size="small"
        sx={{
          minWidth,
          svg: { transform: "scale(1.05)" },
          ":hover": { bgcolor: "#ff000090" },
        }}
        onClick={() => appWindow.close()}
      >
        <CloseRounded fontSize="small" />
      </Button>
    </ButtonGroup>
  );
};
