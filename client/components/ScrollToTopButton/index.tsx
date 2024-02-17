"use client";

import { Affix, Button, rem, Transition } from "@mantine/core";
import { useViewportSize, useWindowScroll } from "@mantine/hooks";
import { IconChevronUp } from "@tabler/icons-react";

const ScrollToTopButton = () => {
  const [scroll, scrollTo] = useWindowScroll();
  const { height } = useViewportSize();

  return (
    <Affix position={{ bottom: rem(16), right: rem(16) }}>
      <Transition transition="slide-up" mounted={scroll.y > (height / 2)}>
        {(transitionStyles) => (
          <Button
            style={[transitionStyles, { "height": rem(40), "width": rem(40), "padding": 0 }]}
            onClick={() => scrollTo({ y: 0 })}
          >
            <IconChevronUp />
          </Button>
        )}
      </Transition>
    </Affix>
  );
}

export default ScrollToTopButton;
