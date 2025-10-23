const Fontawesome = (attrs) => {
    const {
        icon,
        width,
        height,
        size,
        class: className,
        style,
        props,
        ...restProps
    } = attrs || {};

    if (!icon) {
        console.warn("Fontawesome: icon prop is required");
        return null;
    }

    const iconData = icon.icon || icon;

    if (!Array.isArray(iconData) || iconData.length < 5) {
        console.warn("Fontawesome: invalid icon data");
        return null;
    }

    const iconWidth = iconData[0];
    const iconHeight = iconData[1];
    const svgPath = iconData[4];

    const svgWidth = width || size || "1em";
    const svgHeight = height || size || "1em";

    return snapp.create(
        "svg",
        {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: `0 0 ${iconWidth} ${iconHeight}`,
            width: svgWidth,
            height: svgHeight,
            fill: "currentColor",
            class: className || "",
            style: style || "",
            "aria-hidden": "true",
            focusable: "false",
            ...restProps
        },
        snapp.create("path", { d: svgPath })
    );
};

export { Fontawesome };