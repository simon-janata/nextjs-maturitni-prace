"use client";

import "@fancyapps/ui/dist/fancybox/fancybox.css";

import React, { useEffect, useRef } from "react";

import { Fancybox as NativeFancybox } from "@fancyapps/ui";

const Fancybox = (props: {
  delegate?: string;
  options?: object;
  children: React.ReactNode;
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const delegate = props.delegate || "[data-fancybox]";
    const options = props.options || {};

    NativeFancybox.bind(container, delegate, options);

    return () => {
      NativeFancybox.unbind(container);
      NativeFancybox.close();
    };
  });

  return <div ref={containerRef}>{props.children}</div>;
};

export default Fancybox;
