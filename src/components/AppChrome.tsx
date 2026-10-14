"use client";

import BackSwipe from "./BackSwipe";
import IslandFrame from "./IslandFrame";

/** Yalnız uygulamada, her sayfada duran öğeler: Dynamic Island çerçevesi ve kenardan geri hareketi. */
export default function AppChrome() {
  return (
    <>
      <IslandFrame />
      <BackSwipe />
    </>
  );
}
