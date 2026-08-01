# Content Structure

## Introduction
For details, refer to document intro.md

## Appendix

1. Images
   Display all the pictures by Masonry component, include web_1.jpg, web_2.jpg, web_Audiens.jpg, web_Dance.jpg, web_Elsa.jpg, web_flute_solo.jpg, web_Guzheng .jpg, web_Hosts.jpg, web_Irene.jpg, web_poster.jpg, web_Program.jpg, web_view_1.jpg

   For example, the image link is https://pub-51349ba358244889889234b209966c9a.r2.dev/events/20240930/web_1.jpg and the code is

   ```
   import Masonry from './Masonry';

   const items = [
      {
         id: "1",
         img: "https://picsum.photos/id/1015/600/900?grayscale",
         url: "https://example.com/one",
         height: 400,
      },
      {
         id: "2",
         img: "https://picsum.photos/id/1011/600/750?grayscale",
         url: "https://example.com/two",
         height: 250,
      },
      {
         id: "3",
         img: "https://picsum.photos/id/1020/600/800?grayscale",
         url: "https://example.com/three",
         height: 600,
      },
      // ... more items
   ];

   <Masonry
   items={items}
   ease="power3.out"
   duration={0.6}
   stagger={0.05}
   animateFrom="bottom"
   scaleOnHover
   hoverScale={0.95}
   blurToFocus
   colorShiftOnHover={false}
   />

   ```