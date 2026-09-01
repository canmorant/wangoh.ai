/**
 * Görsel atıfları — otomatik üretildi, elle düzenlemeyin.
 * Üreten: scripts/images-localize.mjs
 *
 * Görsellerin çoğu Wikimedia Commons'tan ve CC BY / CC BY-SA lisanslı.
 * Bu lisanslar yazar adının ve lisans bağlantısının gösterilmesini ZORUNLU
 * kılıyor; bu yüzden veri kodda tutuluyor ve arayüzde gösteriliyor.
 */

export interface ImageCredit {
  /** public/ altındaki yol — aynı zamanda anahtar. */
  file: string;
  artist: string | null;
  licenseName: string | null;
  licenseUrl: string | null;
  sourceUrl: string;
  /** CC0 ve kamu malı dışındaki her şey için true. */
  attributionRequired: boolean;
  /** Yüklenirken gösterilecek küçük bulanık önizleme (base64 WebP). */
  lqip: string | null;
}

export const IMAGE_CREDITS: ImageCredit[] = [
  {
    "file": "/images/1-731ade0c.avif",
    "artist": "铁头娃蛤蛤",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:%E4%B8%9C%E6%96%B9%E4%B9%8B%E9%97%A81.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAAAQBACdASoUAA4APu1iqU2ppaOiMAgBMB2JYgCdEf/gPHsynsSZ2NbgAAD8imYInKgHGP9rqf+VC0DyCcIjc8p9o52KgFrs+Ydhdpwv6M8dhNZatXaAAA=="
  },
  {
    "file": "/images/1-tianzishan-wulingyuan-zhangjiajie-2012-d275631f.avif",
    "artist": "chensiyuan",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:1_tianzishan_wulingyuan_zhangjiajie_2012.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAACQAwCdASoUAAoAPu1kqk2ppaQiMAgBMB2JYwDImCHZr20Q7mEAAPzZVSELoaU7UKtCfgEVBHtncLwtRqazeSeyEkAAAA=="
  },
  {
    "file": "/images/1-toledo-spain-aerial-panorama-2014-fa01e297.avif",
    "artist": "Chensiyuan",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:1_toledo_spain_aerial_panorama_2014.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAABwAwCdASoUAAkAPu1krU2ppaSiMAgBMB2JQBOgAnyI8O+yjNgA90ybaS9pQL4XhKHEgtnWdYgzGqWSfOmIOC6xAlVJN7qzCMCSaAAA"
  },
  {
    "file": "/images/1-zermatt-evening-2022-6a14fc5d.avif",
    "artist": "Chensiyuan",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:1_zermatt_evening_2022.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAAAwBACdASoUABMAPu1mqk8ppaOiKA1RMB2JQBfJAexPQxOCXX8G6U1+zAAA/de/EBbmnyCjBIca54qd1qnutCr9+IQ9ibEDkc1Ge99J+FNwSRvZxDkvl/raGFI2JYAA"
  },
  {
    "file": "/images/18-mart-hatime-ana-ulu-camii-mosque-canakkale-vi-64e116e8.avif",
    "artist": "Julian Lupyan",
    "licenseName": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:18_Mart_Hatime_Ana_Ulu_Camii_Mosque,_%C3%87anakkale,_viewed_from_the_Dardanelles_Strait,_2024.jpg",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAAAQBACdASoUAAsAPu1iqU2ppaOiMAgBMB2JYwC06Bi/tG/Emti9xPBAAAD+qCKMVpd0d4HTmAkLa+44W71qKm7fVBAAAA=="
  },
  {
    "file": "/images/2-76d56f15.avif",
    "artist": "Vitaly Ilyin",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:%D0%94%D0%B2%D0%BE%D1%80%D0%B5%D1%86_%D0%B7%D0%B5%D0%BC%D0%BB%D0%B5%D0%B4%D0%B5%D0%BB%D1%8C%D1%86%D0%B5%D0%B22.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADQAwCdASoUAA0APu1mqk2ppaQiMAgBMB2JZgCdHX+gZtfGtfh0N5wA/pCQzFDUFu12Qr3GP2gbCVLbf71xkO/eRLoDj3j+jpw00y0GGJHBYQAA"
  },
  {
    "file": "/images/2009-08-24-06262-lucerne-cfe8ac9e.avif",
    "artist": "Slav Yakounin",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:2009_08_24_06262_Lucerne.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAACQAwCdASoUAAwAPu1kqU2ppaQiMAgBMB2JQBOgAmXykyMudHcAAPPoN6NmYIjWG64LQFicS85y4LXfYXY++yFftAA="
  },
  {
    "file": "/images/20090719-crkva-gospa-od-zdravlja-kotor-bay-monte-3d028112.avif",
    "artist": "User:Ggia",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:20090719_Crkva_Gospa_od_Zdravlja_Kotor_Bay_Montenegro.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACQAwCdASoUAA0APu1kq04ppaQiMAgBMB2JYwCdACIJYeV3NOhAAPukmfRqCsdVfD9WwGO1V9P8JtYSdtzodEz9NXgTWnesyH0AAA=="
  },
  {
    "file": "/images/2018-christiansborg-from-the-marble-bridge-c215c7a0.avif",
    "artist": "Moahim",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:2018_-_Christiansborg_from_the_Marble_Bridge.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAAAQBACdASoUAA0APu1iqU2ppaOiMAgBMB2JaACdMoMYPX9AuSGSUcNx/gDzdlZQ7Fv8TLNtiFF/pZv36V/G/MLsU4Orcz52Ib0A1nOgAAA="
  },
  {
    "file": "/images/2018-nyhavn-on-sunset-3ace5953.avif",
    "artist": "Moahim",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:2018_-_Nyhavn_on_sunset.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAACwAwCdASoUAA0APu1kqk4ppaQiMAgBMB2JQBOkCYhNO57S8D5kYACrh33+IzsuHDhSV5XfKG9BcyJFEVhYhLP4ewKXFNNu05DRXzI/MCtgB4gEMAA="
  },
  {
    "file": "/images/20230429-ansichten-in-novi-sad-039-89e5ca76.avif",
    "artist": "Bybbisch94, Christian Gebhardt",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:20230429.Ansichten_in_Novi_Sad.-039.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACQAwCdASoUAA0APu1qrU8ppiQiMAgBMB2JYwCdAB6FMshCAyGAAP5aAX0vF9DvfTLIpwa/hBcg6lxGoV5JjSw0058YI735oAA="
  },
  {
    "file": "/images/2025-05-16-03-d4e6e6d3.avif",
    "artist": "瑞丽江的河水",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:%E4%BA%94%E5%8D%8E%E5%8C%BA%E4%B8%8E%E7%9B%98%E9%BE%99%E5%8C%BA%E5%A4%A9%E9%99%85%E7%BA%BF_-_%E8%88%AA%E6%8B%8D_-_2025-05-16_03.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAACwAwCdASoUAAsAPu1iqk2ppaQiMAgBMB2JZwAAW55K34/Fl6dUAAD8jomE9FRHQVFBFqxaxvVjyfP+uKbyNx/XXPJgAA=="
  },
  {
    "file": "/images/26935-harbin-29661238117-ae04ce10.avif",
    "artist": "xiquinhosilva",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:26935-Harbin_(29661238117).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAACQAwCdASoUAAoAPu1iqU2ppaOiMAgBMB2JQBOgA8x4AVxrPCAAAP5VIBFKQ6nqkJ3IZCWC/AELF1RwzUNeQx4kyNgAAA=="
  },
  {
    "file": "/images/26y-1599-2-0dad3bb8.avif",
    "artist": "Urdulife",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:26Y_1599_2.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAABQBACdASoUAA0APu1iqk2ppaQiMAgBMB2JYgCdMoMjbDs8ndYHvKPm7uoAAPvY+GkucvMf52f73aRBFOeDY2srzG2at/PdupRpzTqMy5kW6DoiUukwHKoIkqPBY/gAAAA="
  },
  {
    "file": "/images/34-0e4b7c35.avif",
    "artist": "Manojlovic80",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:%D0%9D%D0%B8%D1%88_34.JPG",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACQAwCdASoUAA0APu1kqk4ppaQiMAgBMB2JZQC+SCG4Tz/EUSoYAP7rMnRPj4z0C6wS8Ym1HbHVd8hUFhXrmEewj1OMRRPgAAA="
  },
  {
    "file": "/images/4-cropped-52e01e22.avif",
    "artist": "EditQ",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:%E6%9D%AD%E5%B7%9E%E9%92%B1%E6%B1%9F%E6%96%B0%E5%9F%8E_4_(cropped).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACwAwCdASoUAAoAPu1mqk2ppaQiMAgBMB2JQBOgBCVFUcVoTsv2VAD+s3CfFzXQRdPqIuv3xRDIPVOGsubz4uwL+pjAmq1UL9GQAA=="
  },
  {
    "file": "/images/a-late-evening-view-to-austnesfjorden-at-sildpol-1d49920b.avif",
    "artist": "Ximonic (Simo Räsänen)",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:A_Late_evening_view_to_Austnesfjorden_at_Sildpollnes_Church,_Austv%C3%A5g%C3%B8ya,_Lofoten,_Norway,_2015_April.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADQAwCdASoUAAcAPu1kqU2ppaQiMAgBMB2JQBOmUABqBm+psHNuWsAA/U50zc9Fql9wBxfma6azg3fqVC0Z7IQaXUqNAAAA"
  },
  {
    "file": "/images/a-view-of-rotterdam-taken-from-the-roof-of-the-m-494bccf8.avif",
    "artist": "Rob Oo",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:A_view_of_Rotterdam,_taken_from_the_roof_of_the_Maassilo,_Rotterdam,_The_Netherlands.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADwAwCdASoUAA0APu1mqk4ppaOiMAgBMB2JYwCdACFwwxJcEfXPDdYAAP7enmkPNLIxdfHcQMFaCU5jp7GhgsaEtcpw5rFlJKCUziEha1pAAA=="
  },
  {
    "file": "/images/aalborg-from-the-aalborg-tower-c356afd3.avif",
    "artist": "ClausFalk",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Aalborg_from_the_Aalborg_tower.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAACwAwCdASoUAA0APu1iqU2ppaOiMAgBMB2JZQDE2CHW7lHmTceFOAD+302Bzs2CpeNZvTiUzH5aqklktJHSgor5HFgAAA=="
  },
  {
    "file": "/images/abisko-overview-b561747a.avif",
    "artist": "Ojan",
    "licenseName": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Abisko_overview.JPG",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAACwAwCdASoUAA8APu1mqk2ppaQiMAgBMB2JQBOmUGUgCS/kDfH4YgD+kWEnB7YOSyZJWwDh1a6jx/v5fNO0zqrPHgAAAA=="
  },
  {
    "file": "/images/aerial-image-of-lake-bohinj-view-from-the-south-5a3a7c71.avif",
    "artist": "Carsten Steger",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Aerial_image_of_Lake_Bohinj_(view_from_the_south).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADwAwCdASoUAA0APu1kq04ppaQiMAgBMB2JQBOl65A6c7mdZB1kUxlAAP3jXho9q2pO0Rj3GT1rhtdnxy7AXHmCYuj0XDraWOVWWAAA"
  },
  {
    "file": "/images/aerial-view-of-cardiff-castle-b272b649.avif",
    "artist": "Clint Budd",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Aerial_view_of_Cardiff_Castle.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADQAwCdASoUAAwAPu1qrU8ppiQiMAgBMB2JZQC+SGlfBKQkUEw0rAAA/vbcp3X/CMGN40Kurd5oCh7kA+rpj9Md2jgAAA=="
  },
  {
    "file": "/images/alanyafromcastle-e41fc3b2.avif",
    "artist": "Ozgurmulazimoglu",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Alanyafromcastle.JPG",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAACwBACdASoUAA4APu1iqk2ppaQiMAgBMB2JbACdMoR4PoM39A41KiHT0EH/8B8gAOH8UDvlS2lWTVUKrx7W4w+ZbcYlLEPTUfi6JcKQVYpnVaCxNgAAAA=="
  },
  {
    "file": "/images/alb-20070718-img-1368-36d73e16.avif",
    "artist": "Dori",
    "licenseName": "CC BY 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.5",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:ALB_20070718_img_1368.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADQAwCdASoUAAwAPu1kqU4ppaOiMAgBMB2JQBOgBDvQyn1B51i2LwAA/q77L1sbCT9/7NmoPHcDw3I3fFazrfO6jhdQigAA"
  },
  {
    "file": "/images/aleja-niepdleglosci-warsaw-2022-aerial-cropped-3cb12cdd.avif",
    "artist": "Emptywords",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Aleja_Niepdleglosci_Warsaw_2022_aerial_(cropped).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADQAwCdASoUAAwAPu1oqk6ppiQiMAgBMB2JYwCdABuD2CrEPM9kqjwA/t7nwGEp66jyIcRgisPHW3ceJ4HgiOfUhrTvWsNmgAA="
  },
  {
    "file": "/images/alhambra-granada-001-panorama-40a13d85.avif",
    "artist": "Roland Geider (Ogre)",
    "licenseName": "Public domain",
    "licenseUrl": null,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Alhambra_-_Granada_-_001_-_Panorama.jpg",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAACQAwCdASoUAAQAPu1Ct1apoqakGAEwHYllAJ0ygANT9ZZMkXaAAP68kCBLZCs0tsMCttoAkMe0rHEAAAA="
  },
  {
    "file": "/images/altstadt-zurich-2015-42e3e9dc.avif",
    "artist": "Thomas Wolf, www.foto-tw.de",
    "licenseName": "CC BY-SA 3.0 de",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/de/deed.en",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Altstadt_Z%C3%BCrich_2015.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAACwAwCdASoUAAsAPu1iqU2ppaOiMAgBMB2JQBOgA7sHFvDmUohLAAD3CbMPLKRoE+erLEgEyv+3FbOBPCd3C3Zsqr3TCiGpWmKSpkugAAA="
  },
  {
    "file": "/images/amberes-vistas-mas-2-cfe54905.avif",
    "artist": "LBM1948",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Amberes;_vistas_MAS_2.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAABwAwCdASoUAA4APu1yrU+pp6QiMAgBMB2JZwDImCHWk+ADCCAA/t5cHPbNL+67cYvp5ViDagTx1E+MAAA="
  },
  {
    "file": "/images/ambleside-waterhead-panorama-cumbria-england-oct-bc2b874b.avif",
    "artist": "Diliff",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Ambleside_%26_Waterhead_Panorama,_Cumbria,_England_-_Oct_2009.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAACwAwCdASoUAAYAPu1mq04ppaQiMAgBMB2JYgCdACHXWVFwgIwYAAD3zKyfmZizPe7LIbJrwYtP1+4rp8RjkT1hppDQAA=="
  },
  {
    "file": "/images/amsterdam-prinsengracht-wallpaper-649fad10.avif",
    "artist": "Juke Schweizer",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Amsterdam_Prinsengracht_Wallpaper.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAADwAwCdASoUAA0APu1kqU2ppaQiMAgBMB2JZACdAB6MeXUVTA85LhIAAPo0YmZMtkL4ipCnIsslVvaeqtEGtW5uL0Zro5siPXteeu099FwyZ1CJdlUAAA=="
  },
  {
    "file": "/images/ankara-castle-cba862d0.avif",
    "artist": "Bernard Gagnon",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Ankara_Castle.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADQAwCdASoUAA0APu1orU6ppiSiMAgBMB2JYgCw7B7BHDD5gD3MLAgA/t7c+7DgAKIyXn5bmov1u+fTu/9MIDQWZL8EGCdrJnJzQxYQAAA="
  },
  {
    "file": "/images/antonio-vaz-island-recife-pernambuco-brazil-crop-4d4819ac.avif",
    "artist": "Portal da Copa/ME",
    "licenseName": "CC BY 3.0 br",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/br/deed.en",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Antonio_Vaz_island_-_Recife,_Pernambuco,_Brazil_(cropped).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACwAwCdASoUAAoAPu1iqU2ppaOiMAgBMB2JQBadBDm4S62321dJQAD8bUAVHs8zdQ4vPlz5sMkBCVShg6nNOv2V2qYpRuVfEgAAAA=="
  },
  {
    "file": "/images/athens-acropolis-at-daybreak-b22d12e7.avif",
    "artist": "Andrew Parlette",
    "licenseName": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Athens_Acropolis_at_Daybreak.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADQAwCdASoUAAsAPu1kqU4ppaOiMAgBMB2JYgCdAB7A7DxenyRuyAAA/U7zJaOIlJQoobrWerUS5wlDmewDKWesAOr1nO+cBZfpwAAA"
  },
  {
    "file": "/images/aurlandsfjorden-fr-sn-vegen-7c1f9aa9.avif",
    "artist": "Kenny Louie",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Aurlandsfjorden_fr%C3%A5_Sn%C3%B8vegen.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAAAwBACdASoUAA0APu1kqU4ppaOiMAgBMB2JYgC7LwAB0ptOz/q781meugAA98xSVa1e/He58j3NgO2qArNQfB/wRoO7wh1bpZnvyTUCoAA="
  },
  {
    "file": "/images/bahia-de-concha-de-san-sebastian-5ce9b1c5.avif",
    "artist": "双的戏谑国",
    "licenseName": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Bah%C3%ADa_de_Concha_de_San_Sebastian.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAAAQAwCdASoUAAIAPu1iqk2ppaQiMAgBMB2JaACdMoAEccAA/tpH10balFJSoADx45z0qQTbPzBXETZoQxjbuWAA"
  },
  {
    "file": "/images/baikal-a2001296-0420-250m-nasa-02cea68b.avif",
    "artist": "Jacques Descloitres, MODIS Land Rapid Response Team, NASA/GSFC",
    "licenseName": "Public domain",
    "licenseUrl": null,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Baikal.A2001296.0420.250m-NASA.jpg",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAACwBACdASoUABoAPu1qpk4ppiMiMBgMATAdiWUAyrQOziRSanczpb7FH0LLxAMuAMsOq2RN+xUhE5oBj16x9McJ6RiJCX5lEyh+toWFGOpbx0mUBr71K+AA"
  },
  {
    "file": "/images/balaton-hungary-landscape-0055678e.avif",
    "artist": "txd",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Balaton_Hungary_Landscape.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADQAwCdASoUAA0APu1kqk4ppaQiMAgBMB2JYgDE2BZ1aTpxqW3XPgAA4Q0SKELIQyqip0IWa9JtSIN1fuQqOGRPj9sgAAAA"
  },
  {
    "file": "/images/balikligol-urfa2-ae7ecf43.avif",
    "artist": "Anadolu",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Bal%C4%B1kl%C4%B1g%C3%B6l_Urfa2.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAABQBACdASoUAA8APu1iqk2ppaQiMAgBMB2JYgCdMoMYACd4HDkudbzVBeBAAPxLbou2STou5F8gu21mCME5tf2uoOw1mvsMAt5A9lX3KSxU7Fy+ePfZnu/UzUI2BaC0AAA="
  },
  {
    "file": "/images/bandung-view-dari-gedung-wisma-hsbc-asia-afrika--650bf53b.avif",
    "artist": "F1fans",
    "licenseName": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Bandung_View_dari_Gedung_Wisma_HSBC_Asia_Afrika_4.jpg",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACwAwCdASoUAAsAPu1kqU2ppaQiMAgBMB2JZQC/OCHRlFKw+nYaQAD+tfOaF8iqaUn5f7sabGM9WYQGTnAsNuve+mUNhGN1sfgAAA=="
  },
  {
    "file": "/images/barcelona-airport-approach-27733825928-10e3b233.avif",
    "artist": "Mike McBey",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Barcelona,_airport_approach_(27733825928).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAABQAwCdASoUAAsAPu1Ct1apoqakGAEwHYljAKwAaFmL60N8wAD+9jRtECTTFCO/Qfk+h/c0RjHkswq6TkOjW67qQqV1qwAA"
  },
  {
    "file": "/images/barentsburg-late-winter-38f625de.avif",
    "artist": "Andre Shutterbird",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Barentsburg,_late_Winter.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAACwAwCdASoUAA0APu1kqU2ppaQiMAgBMB2JQBOmUAAuN3rJ1easgAD9DP9ewp1FGiIx2lLr+PD6Ok80DmUXaD3lgAA="
  },
  {
    "file": "/images/beach-club-canggu-47ff92b6.avif",
    "artist": "Schweigeblick",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Beach_Club_Canggu.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAAAQBACdASoUAA8APu1iqk4ppaQiMAgBMB2JQBOkBshernztQWMSbSsHAAD9zrfNZYbXn4DgfNXaZMPL/dYMXXynk2Y4YXzmkiYwvRh5E4cMOAAA"
  },
  {
    "file": "/images/beinn-a-chrulaiste-buachaille-etive-mor-buachail-5f46d4b2.avif",
    "artist": "Spike",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Beinn_a%27Chrulaiste_Buachaille_Etive_M%C3%B2r_Buachaille_Etive_Beag_01.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAADQAwCdASoUAAMAPu1qrU8ppiQiMAgBMB2JYwCo9CK49qsR1OYLewAAy0E4jb6YyhR6vd6cTbfXLlFFfv8AAA=="
  },
  {
    "file": "/images/belfast-city-hall-belfast-northern-ireland-uk-au-0ac21db8.avif",
    "artist": "Giorgio Galeotti",
    "licenseName": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Belfast_City_Hall_-_Belfast,_Northern_Ireland,_UK_-_August_13,_2017_-_01.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAACwAwCdASoUAAkAPu1krU2ppaSiMAgBMB2JZwAAXFecfWT/2ImFwAD+rxh2PJ/XrkuTSpdA53spp/fz7x+k0gPv39dkAA=="
  },
  {
    "file": "/images/berat-57-0492aaeb.avif",
    "artist": "Arianit",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Berat_57.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACwAwCdASoUAAsAPu1kqk2ppaQiMAgBMB2JZwCdAB6BQlw5GFlgAAD+oG9aiexYKu+nMJAIyKe+j0KTwqa4G9o7MEP+Ry6gAAA="
  },
  {
    "file": "/images/bergen-panorama-at-night-panoramio-1-7a85de94.avif",
    "artist": "TomasEE",
    "licenseName": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Bergen_panorama_at_night_-_panoramio_(1).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAABwBACdASoUAA0APu1orU6ppiSiMAgBMB2JYgCdICXDBt7morqTvJD6Xf76gADLPmmBiaTisQSC5Oqk5hvI3zqjyU19je4g5HJpKRWgWScaVMkTD/YzFAAA"
  },
  {
    "file": "/images/bilbao-guggenheim-aurore-2b8bd743.avif",
    "artist": "PA",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Bilbao_-_Guggenheim_aurore.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADwAwCdASoUAA0APu1oqk6ppiQiMAgBMB2JYwCsH8ADFYM85VuSIlBwAP5lkMwkupwmjrnADIXt/s96qtD9vraInCWqGfckAAA="
  },
  {
    "file": "/images/black-dragon-5496141333-2f50d522.avif",
    "artist": "Miltos Gikas from Lutsa, Attiki, Greece",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Black_Dragon_%E9%BB%91%E9%BE%99%E6%BD%AD_(5496141333).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADwAwCdASoUAA0APu1oqk6ppiQiMAgBMB2JYgCdMoMYACMSlFBTMwYAAMmoiISFODkC3JGjf9HXdvKlPMJU2op5kehLSzmFlFNAVm6alNEAAA=="
  },
  {
    "file": "/images/blick-auf-das-stadtzentrum-von-krumau-2026-a5d13f0f.avif",
    "artist": "DominikCK1999",
    "licenseName": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Blick_auf_das_Stadtzentrum_von_Krumau_(2026).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAABwAwCdASoUAA8APu1iqU2ppaOiMAgBMB2JQBadBDsEa/GJ8FAA/t87BsOwHT2Mh4RAZybH7uxLdzzKpedwg/M9Fr1VNtoXqkAAAA=="
  },
  {
    "file": "/images/blick-vom-hohfelsen-bf7faa3f.avif",
    "artist": "MWolf89",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Blick_vom_Hohfelsen.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAACwAwCdASoUAAwAPu1krU2ppaSiMAgBMB2JQBOgBDuN7PgxpxBCAAD924e6qvJ1ptzzaNXXHRLlTsSbP5NgTtqpeAh3H1AA"
  },
  {
    "file": "/images/breiavatnet-stavanger-norway-2021-08-01-02-1d9b0872.avif",
    "artist": "Ryan Hodnett",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Breiavatnet_-_Stavanger,_Norway_2021-08-01_(02).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADQAwCdASoUAAsAPu1mqk2ppaQiMAgBMB2JYwCdACHcOblFXR5g99AA/pTVvwDnKk2qiVjyinDe2D/fiYVuReZiPRtQYLdqDBgu9k+1kKAAAA=="
  },
  {
    "file": "/images/brighton-pier-brighton-east-sussex-england-2oct2-fb9069d7.avif",
    "artist": "Ian Stannard from Southsea, England",
    "licenseName": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Brighton_Pier,_Brighton,_East_Sussex,_England-2Oct2011_(1).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADQAwCdASoUAA0APu1iqk2ppaQiMAgBMB2JQBOl4AAvOGBu3mDxrQAA+47aXYzmgftsH2wHVpFoMrRgxoDj/T+dIONGYyIsITgAAA=="
  },
  {
    "file": "/images/brno-montage-iv-2c688514.avif",
    "artist": "Brno-Freiheitsplatz2.jpg: SchiDD Brno_Katedrála_sv._Petra_a_Pavla_(St.Peter_and_St.Paul_Cathedral).jpg: JRodSilva Brno-Lužánky_XIV.jpg: Millenium187 Brno,_Vila_Tugendhat.jpg: Petr1987 Ignis_Brunensis_Grandfinale_2007.jpg: Jiří Nedorost Brno,_BVV,_výhled_z_výškové_budovy_(11.29.22).jpg: Martin Strachoň Hrad_Špilberk,_Brno_04.jpg: Doronenko",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Brno_Montage_IV.png",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRqwAAABXRUJQVlA4IKAAAAAQBgCdASoUACQAPt1apE2opSOiOrZoARAbiWIAqSfsQ5ChuwzdAzj4llBtNilNQ3LZca5qdwNa4MAA/eNCrKKSbM3v7IZOr8PmiQmVPiAHc9h/4Wi2vuvEY4StB6O3r3XOm18Ja1a5jFykdJ2Qq2U/0wmanmZ+zvhPZ3eaGSpI8jbZqixSIwd3n7LbOYf6tD8ebh+aE6leKmkYek8yJUAA"
  },
  {
    "file": "/images/broken-bay-nusa-penida-4a9a7a35.avif",
    "artist": "Georgi Kovachev",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Broken_Bay,_Nusa_Penida.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAABwAwCdASoUAAsAPu1iqk4ppaQiMAgBMB2JQBYdgqusT6bAW/IA+0bJ7N7kmjiR/bhGj6SwfR9p4tcNqFABlKlDRPkRtbI1biHzeYAA"
  },
  {
    "file": "/images/bromo-semeru-batok-widodaren-967da778.avif",
    "artist": "Riza Nugraha ? from Utrecht, The Netherlands",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Bromo-Semeru-Batok-Widodaren.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAADwAwCdASoUAAsAPu1kq04ppaQiMAgBMB2JYgCdEf/gQHgFPeWwyUNMAP7FTUrdGhviZpepn8ADEsX+cskR/LqzqBCQkDA2V9IT3S/bxpAbsypwy+T8AAAA"
  },
  {
    "file": "/images/brugge-blick-vom-belfried-4-4ce5908b.avif",
    "artist": "Zairon",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Br%C3%BCgge_Blick_vom_Belfried_4.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAACwAwCdASoUAA0APu1iqU2ppaOiMAgBMB2JZQCsAB8vVRcwbAYpIAD+3uwywrk9PsfAcpvD8W2lC4JjVeeDRV59s1EkIAAA"
  },
  {
    "file": "/images/budva-26871774051-aef85074.avif",
    "artist": "Nick Savchenko from Kiev, Ukraine",
    "licenseName": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Budva_(26871774051).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAAAQBACdASoUAA0APu1iqU2ppaQiMAgBMB2JagCdMoMYAEklbpOclm6csAD+7YC4dfFRNevw1Zay2f/Fc0zvclhBp/wxNHKVmE9zF0+p+KGGOgKb+ZvTSjw02D/YQAAA"
  },
  {
    "file": "/images/bundeshaus-bern-2009-flooffy-ccc5c793.avif",
    "artist": "Flooffy",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Bundeshaus_Bern_2009,_Flooffy.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADwAwCdASoUAA0APu1kqk4ppaQiMAgBMB2JYgCdABKgHFJHvzeKB/kAAMqR9v5fjC+dDNSJe2U0lFefs5za3/UxTlI2a0L9INEB4BhLg4UAAA=="
  },
  {
    "file": "/images/burgerstra-e-26-24-bt0a2830-cfcff283.avif",
    "artist": "Simon Legner (User:simon04)",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:B%C3%BCrgerstra%C3%9Fe_26%2B24_(BT0A2830).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADQAwCdASoUAA0APu1iqU2ppaQiMAgBMB2JZACdMoADUn0qMYvXUgAAydjJrHaWuY1ic6rTKcoZNBzpXsgxDPxb0Cn7JForliI8fBNcoAA="
  },
  {
    "file": "/images/bursa-image-943a21e4.avif",
    "artist": "Metuboy",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Bursa_image.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAACQAwCdASoUAAoAPu1orU6ppiSiMAgBMB2JZQC7ACEkv7wfWoOIAP7rJu5HbsZJ5ZH9OSZcLi4f43jzes/xmuAHYRmGAA=="
  },
  {
    "file": "/images/calle-dlugie-pobrzeze-gdansk-polonia-2013-05-20--071953b3.avif",
    "artist": "Diego Delso",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Calle_Dlugie_Pobrzeze,_Gdansk,_Polonia,_2013-05-20,_DD_06.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAAAwBACdASoUAAsAPu1kqk2ppaQiMAgBMB2JYwCdACKqxdwoKcqUKeVcJKAA/pgR1o5IoGB9WRxYdrNdC3WNOD4k9n51W1ReMku1gAAA"
  },
  {
    "file": "/images/cambridge-kings-college-vue-des-backs-cf28ed90.avif",
    "artist": "Jean-Christophe BENOIST",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Cambridge_-_Kings_College_vue_des_backs.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADQAwCdASoUAA0APu1kqk4ppaQiMAgBMB2JZACdAB6JUU6FgNw84QAA/mZg8Vi2rFFy1WD3DRpoM6AySCT2F9Dsl1GjGbnfTKJYPIHeUAAAAA=="
  },
  {
    "file": "/images/camping-above-the-clouds-at-rinjani-62922f5c.avif",
    "artist": "Paxson Woelber",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Camping_above_the_clouds_at_Rinjani.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAAAwBACdASoUAA0APu1kqk4ppaQiMAgBMB2JQBOl4AA6U532eehyFPastgAA/rB5nn3W6UcK4U0+tJm7p59ZSKig6wF3DqW9zSIAAA=="
  },
  {
    "file": "/images/cancun-strand-luftbild-22143397586-f8762d89.avif",
    "artist": "dronepicr",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Cancun_Strand_Luftbild_(22143397586).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAADQAwCdASoUAAsAPu1iqU2ppaOiMAgBMB2JZgCdAB7H2/e1RikwYAAA/naf4NjD3rVtbuPyb2ReVhfu34pnf4V4gxnWCi9CwwVIyprN2LVGoVrmogAAAA=="
  },
  {
    "file": "/images/canton-tower-20241027-3e72716a.avif",
    "artist": "Tim Wu",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Canton_Tower_20241027.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAABwAwCdASoUAA0APu1kqk4ppaQiMAgBMB2JZgCdAB5hM83zYcAA/K4PZw860OmH/pu1n2PWhlDbs4Bz/24RI34qU9OMO2dYAAA="
  },
  {
    "file": "/images/cappadocia-aktepe-panorama-7092c680.avif",
    "artist": "Bjørn Christian Tørrissen",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Cappadocia_Aktepe_Panorama.JPG",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAAAQBACdASoUAAgAPu1mq04ppaQiMAgBMB2JZgCdMoMxgEI0P6DM4iFDoADKq599ZBRXm0VU5TojtqJ1qEusdAaTy5pD3kn0SFSwAA=="
  },
  {
    "file": "/images/castle-combe-cotswolds-fdd0d008.avif",
    "artist": "Saffron Blaze",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Castle_combe_cotswolds.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAAAQBACdASoUAA4APu1iqk2ppaQiMAgBMB2JQBOkGQBfygxKevMy3X56vAD8blgZU6lz+TJGHD17l0DlX12y85x9iXAnWcsx5T5nsxkfvmBFROuAAAA="
  },
  {
    "file": "/images/catedral-desde-el-lago-nahuel-huapi-panoramio-c0537312.avif",
    "artist": "enzofloyd",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Catedral_desde_el_Lago_Nahuel_Huapi_-_panoramio.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAACwAwCdASoUAA0APu1kqU4ppaOiMAgBMB2JYwDImB4C2zRix9FsAAD9+ZlxRGuM35GZdZkssQsw6HJfEyqirRwg8Lvq8OHr1b5CHVbBAAA="
  },
  {
    "file": "/images/central-surabaya-view-taken-from-jw-marriott-sur-474728c3.avif",
    "artist": "consigliere ivan",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Central_Surabaya_view_taken_from_JW_Marriott_Surabaya.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADQAwCdASoUAAoAPu1mqk2ppaQiMAgBMB2JZQC/OBcUv1nu6/ZuxKAA4CpHwHyYEjPfjs//nZpSnutuUg38wYgAAAA="
  },
  {
    "file": "/images/chengdu-skyline-with-snow-capped-mountains-c54474e1.avif",
    "artist": "FISU",
    "licenseName": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:%E9%9B%AA%E5%B1%B1%E4%B8%8B%E7%9A%84%E6%88%90%E9%83%BD%E5%B8%82%E5%A4%A9%E9%99%85%E7%BA%BF_Chengdu_skyline_with_snow_capped_mountains.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADQAwCdASoUAAsAPu1orU2ppqSiMAgBMB2JYwCdMoADThEC8tWfRDAA/t6rxKK5E/ACNbJlCzEVdPlIE+k0S9ysLDQAAA=="
  },
  {
    "file": "/images/chongqing-nightscape-8a919630.avif",
    "artist": "Jay Huang",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Chongqing_Nightscape.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACQAwCdASoUAA0APu1iqU2ppaOiMAgBMB2JQBWAA8pkKCLvj2lAAP7sRBa+NrltmAtwXRusauOaXuLeZc636c6+kwdEVacgAAA="
  },
  {
    "file": "/images/chongsheng-temple-11050634113-9440447f.avif",
    "artist": "Andrew and Annemarie",
    "licenseName": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Chongsheng_Temple_(11050634113).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAACQAwCdASoUAA0APu1iqk2ppaQiMAgBMB2JaACdACHWrXLVzvxAAPpX9rU21SBhWe58m+Ykw7tl9ZvuBdzgmfJW7T7KisIbRpKIAAAA"
  },
  {
    "file": "/images/cidade-maravilhosa-5799e549.avif",
    "artist": "Rafael Rabello de Barros",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Cidade_Maravilhosa.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAABQBACdASoUAAsAPu1orU6ppiSiMAgBMB2JQBOmUIGBTtQ3ze9QEZdriAfAAPdcsKpkvB3HIYk3cl6+55p0jowKBd39537rhv5MB0qPzMgAAA=="
  },
  {
    "file": "/images/city-of-saranda-albania-2016-32d8c5d3.avif",
    "artist": "Photo: Gary Bembridge",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:CIty_of_Saranda_Albania_2016.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAACwAwCdASoUAAwAPu1kqU4ppaOiMAgBMB2JYgCdABsp8Uf5smEAAAD9MPquSAYjiN9VH7TchtMv1THeF/1yBJ11wspHTae+C428cUZSCdSCYfxn8SAAAA=="
  },
  {
    "file": "/images/city-wall-of-xi-an-51550-xian-27959363326-b960c67c.avif",
    "artist": "xiquinhosilva",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:City_wall_of_Xi%27an_51550-Xian_(27959363326).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAACwAwCdASoUAA0APu1oqk6ppiQiMAgBMB2JYgCw7BM8qKAv1cM0gAD+lMtgK5BmeUG0m8/iNzi3gjXjm1Fz8hzYaTyf9OQ0G4+zwwAA"
  },
  {
    "file": "/images/clifton-suspension-bridge-and-the-observatory-in-f1734b67.avif",
    "artist": "Chris Lathom-Sharp",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Clifton_Suspension_Bridge_and_the_Observatory_in_Bristol,_England.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADQAwCdASoUAAsAPu1kqU2ppaQiMAgBMB2JQAALfEN66DTEdK1b31gA/pGgGmNoDrFXvtq20vmApoLbjLkPIUS9/sWWLV/gw/1qON5AAAA="
  },
  {
    "file": "/images/clouds-over-lombok-strait-boats-gili-islands-wes-0311e436.avif",
    "artist": "Vyacheslav Argenberg",
    "licenseName": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Clouds_over_Lombok_Strait,_Boats,_Gili_Islands,_West_Nusa_Tenggara,_Indonesia.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAACwAwCdASoUAA0APu1kqk4ppaQiMAgBMB2JQBOmUABfbmsQlfzVugD+VEoDdOFPlH2/qyPY1J/MuoduLKzCq1qe8sGNYAAA"
  },
  {
    "file": "/images/coimbra-e-o-rio-mondego-6167200429-cropped-34e63c70.avif",
    "artist": "Leandro Neumann Ciuffo",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Coimbra_e_o_rio_Mondego_(6167200429)_(cropped).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAACwAwCdASoUAAoAPu1kqk2ppaQiMAgBMB2JZACdGuABFm3Vwj+sAAD+WSWdHKzNVTLOp/MD9eE9Pn3UAffnqXAPm2/Mu2PlHpJVK6b9T54MS4IAAAA="
  },
  {
    "file": "/images/collage-merida-yucatan-47d5035d.avif",
    "artist": "the above mentioned",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Collage_Merida_Yucatan.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRqwAAABXRUJQVlA4IKAAAADQBQCdASoUACEAPt1Sp02opCOiNVv8ARAbiUAWHYPi+8agAjXjbz1Ya9XJt6JSttEknGr92vhgAP7uyLI1sAWy7tIemMiJkjL2+jJTKaF9zfXjiSc0Jfv6oVhPivAizObDB8nesJvdAkmbYF0zJ12/pEO+8kmypxAKKi988vfCZsjzFW+F777ceuwtNkKQGvcGS48dKkU/OkRqXGcHRhgA"
  },
  {
    "file": "/images/commercial-area-of-futian-to-east2020-1f047c62.avif",
    "artist": "Charlie fong",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Commercial_area_of_futian_to_east2020.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAACwAwCdASoUAA0APu1qrU8ppiQiMAgBMB2JQBOgBDrwTNIpETXzAAD+WUH27cXG9HSCXimQfAXLLlTMhrSItr7NPI89mbYA"
  },
  {
    "file": "/images/competa-complete-panorama-view-golden-hour-02-20-c1d4dcc6.avif",
    "artist": "Tuxyso",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:C%C3%B3mpeta_Complete_Panorama_View_Golden_Hour_02_2014.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAACwAwCdASoUAAcAPu1kq04ppaQiMAgBMB2JYwCdO/7Auryd66FcAAD9TmUoIqZ8cqLElJG33E6mU5hKyLHp8JRAYMbg2IaIAhR2yAAA"
  },
  {
    "file": "/images/cordoba-aerial-2-8a5ec755.avif",
    "artist": "kallerna",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:C%C3%B3rdoba_aerial_2.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAACQBACdASoUABIAPu1orFCppaQiqAqpMB2JZQCsAA9kfyYaURJSwSn6sgDF6AAA/GczK1Z7EGrSQjkCGJ+cb6JHfLYA8cts0Yz+HbA5/ypbJnCp05LzOxh0p9OHF8jAAAA="
  },
  {
    "file": "/images/croatia-rovinj-56786943.avif",
    "artist": "Mussi Katz from Israel",
    "licenseName": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Croatia_-_Rovinj.jpg",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACQAwCdASoUAAsAPu1yrU+pp6QiMAgBMB2JZwDG9CHXGEs1boFAAP7fIzOEXIvO+v4NVE90WI394ifrKw0DxYpRvSMaWGnqgAA="
  },
  {
    "file": "/images/cumhuriyet-square-a10a1e9d.avif",
    "artist": "Michael ksk",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Cumhuriyet_Square.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADwAwCdASoUAA8APu1oqk6ppiQiMAgBMB2JZQCsACHWdKumERiX/AuAAP60hyz2JS6KORlgAhTFCeXgbpFwMgRYaER/R4UaQvKIAA=="
  },
  {
    "file": "/images/da-gibralfaro-cropped-2-d2400496.avif",
    "artist": "Kiban",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Da_Gibralfaro_(cropped)2.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADwAwCdASoUAAkAPu1iqk4ppaQiMAgBMB2JZACdICXCuOxoFke9QGwAAM1CpHPP3ZNv4XpovsxnNj42YkVI40eB5Z++wtuJHoAAAA=="
  },
  {
    "file": "/images/dalarna-sommar-1986-5762e0f2.avif",
    "artist": "Holger.Ellgaard",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Dalarna_sommar_1986.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADQAwCdASoUAA4APu1oqk6ppiQiMAgBMB2JZQC+SCHh+tMY4xboSoAA+6V3vlaYzzrx9Di+ENTSORzrSh+3R3ixHBsWJCc/z2uvgAAA"
  },
  {
    "file": "/images/danube-near-iron-gate-2006-636eefa1.avif",
    "artist": "Cornelius Bechtler",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Danube_near_Iron_Gate_2006.JPG",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAADwAwCdASoUAA8APu1krU6ppaSiMAgBMB2JQBOgBFFPWLs47GjqiluAAPyPwdbVcgUjNy/Zof22513H4ZlGwBHDbO7779mbsc1dXSsGxAYXWvmX0jjdgAAA"
  },
  {
    "file": "/images/delft-blick-von-der-nieuwe-kerk-auf-die-oude-ker-6e37484f.avif",
    "artist": "Zairon",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Delft_Blick_von_der_Nieuwe_Kerk_auf_die_Oude_Kerk_1.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAACwAwCdASoUAA4APu1iqk4ppaQiMAgBMB2JYwCw7CHRxssRL7xaaAD3zD00IGLTPbvmMSrclS56a1pcUB1IVoAA"
  },
  {
    "file": "/images/den-haag-skyline-1-cee465f4.avif",
    "artist": "Zairon",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Den_Haag_Skyline_1.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADQAwCdASoUAA0APu1krU6ppaSiMAgBMB2JYwCdMoACMB3/SZ+AbuwA/lRJzrtphnyRvMESZMCSmXSCYzLEK2LwD3I/KtHkiIWkCci5BakrgAAA"
  },
  {
    "file": "/images/dinant-reflected-bee8b6a4.avif",
    "artist": "https://www.flickr.com/photos/jiuguangw/",
    "licenseName": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Dinant_reflected.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAAAwBACdASoUAA0APu1qrU8ppiQiMAgBMB2JZgCdMoMjbElrnWVMT8foFIAA90wUTOSbGDvubTtrq6Brg6EWBQmbfrZ1PSteNiqjmhMgffHn0c9pQAA="
  },
  {
    "file": "/images/downtown-mendoza-5c12e509.avif",
    "artist": "David",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Downtown_Mendoza.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADQAwCdASoUAA0APu1krU6ppaSiMAgBMB2JQBadBDrVlizGtf6pKAAA/suJlAOCMbAU8/kiJkQRGgA8ZjGyv/XOKAiUfMPUAAA="
  },
  {
    "file": "/images/downtown-puerto-iguazu-misiones-argentina-6th-ja-2093592c.avif",
    "artist": "Phillip Capper from Wellington, New Zealand",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Downtown_Puerto_Iguazu,_Misiones,_Argentina,_6th._Jan._2011_-_Flickr_-_PhillipC.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADQAwCdASoUAA0APu1mqk2ppaQiMAgBMB2JQBXDgw4MhvGO4drGboAA/uWgVj0PriWazwejj5rVrSc34E1leLCb0TuVk2umpUaBTiK4AAA="
  },
  {
    "file": "/images/drone-photo-of-dokk1-in-aarhus-denmark-d9f682d2.avif",
    "artist": "SmartDrones Aarhus",
    "licenseName": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Drone_photo_of_Dokk1_in_Aarhus,_Denmark.jpg",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAABQBACdASoUAA4APu1kqU2ppaQiMAgBMB2JQBOmUGMACTY8VCYq04wkzowAAPxs2q3njPuHNneRsdTUOpEZCEfEgPDCFCUbaDr2z9oNpCs2KGEsMkseropDOAA="
  },
  {
    "file": "/images/dunas-de-maspalomas-fe79ae52.avif",
    "artist": "Himarerme",
    "licenseName": "Public domain",
    "licenseUrl": null,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Dunas_de_Maspalomas.jpg",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAAAQBACdASoUAAsAPu1iqU2ppaOiMAgBMB2JZQCdH8ADAeB2fPsFkN05wAD8i7oW0pD8h2ynRA8tttQWE9d6Cl/zjAA="
  },
  {
    "file": "/images/durmitor-afca806a.avif",
    "artist": "Andrea Polereczky",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Durmitor.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAABwAwCdASoUAA0APu1Ct1apoqakGAEwHYlAFh2ENXu/ErOjDsAA/uGEFzpx6lkzfymwvot3suZmnzDO6bZ9OTQtejeRhwwX6x+EvwAA"
  },
  {
    "file": "/images/eger-montage-0019d81f.avif",
    "artist": "Imoti95",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Eger_montage.JPG",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAABwBACdASoUABEAPu1mqk2ppaQiMAgBMB2JYwCsM47Cl1lBU4taeY48VowgyAD+Iy288pO5czSUTYkpO6Jo00uYLmSQIP5iVXhymczaM7OBppxWQUwiA+c/1LgvJiF8w2vU9H5XKtxT6kqAAAA="
  },
  {
    "file": "/images/el-calafate-25825005237-08ff16fe.avif",
    "artist": "Deensel",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:El_Calafate_(25825005237).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAABwAwCdASoUAA8APu1kq04ppaQiMAgBMB2JQBOgA7l0KiNPeKAAzc5WmjvuN6yzMsLDv3rVwIyDYjDwDezJ35/isX6KcFnXWH4buEAA"
  },
  {
    "file": "/images/el-chalten-8719a3b9.avif",
    "artist": "David",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:El_Chalt%C3%A9n.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADQAwCdASoUAAwAPu1Ct1apoqakGAEwHYlkAJ0vAAWfTnsRTPJW8vQA/sX606Z4Oriig3vg77ArXnkOWHGX3g5G4vf+YqrZNaxZZQAA"
  },
  {
    "file": "/images/exterior-winter-2016-17-fotograf-romano-salis-21-2b0069d2.avif",
    "artist": "Travelleronthego49",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Exterior_Winter_2016_17_Fotograf_Romano_Salis_(21).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAADQAwCdASoUAA0APu1iqU2ppaOiMAgBMB2JZQC7ACHf4984n3dPd8AA/vKZpJWwF0uRljBE2qcZgtZ7IrRBAAAA"
  },
  {
    "file": "/images/falezlerden-antalya-konyaalti-plajina-dogru-bir--9cd83083.avif",
    "artist": "Esginmurat",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Falezlerden_Antalya_Konyaalt%C4%B1_Plaj%C4%B1na_do%C4%9Fru_bir_g%C3%B6r%C3%BCn%C3%BCm.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADQAwCdASoUAAsAPu1mqk4ppaOiMAgBMB2JbACdACHwI3bf8PbDo5gA/tPj9VetBiB7B44gVjVlaVXI8tKjXHeKTaHZVmDORrrjUNmnDgtbhJXAQAA="
  },
  {
    "file": "/images/ferenc-mora-museum-2021-03-02-szeged-ebf8f103.avif",
    "artist": "Szilas",
    "licenseName": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Ferenc_M%C3%B3ra_Museum_2021-03-02,_Szeged.jpg",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADwAwCdASoUAA0APu1mq04ppaQiMAgBMB2JZACdH8ADA1LkHYyernwQAPKZRwk8lTHk3xtpc11fas0KrMjXWdAVYfAnL7V4s1ex+at0XQlPvWAA"
  },
  {
    "file": "/images/fethiye-town-in-daylight-cropped-5723df04.avif",
    "artist": "Alexander Annenkov from Moscow, Russia",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Fethiye_Town_in_Daylight_(cropped).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAACQAwCdASoUAA0APu1kqU2ppaOiMAgBMB2JbACw7CHXXDsQQ9VoAN4xjrtcNGlAV5bWHxt7TGhVVX+SJ76LgB4G7kOZwRmWv+nHnAwW8J8XOAAA"
  },
  {
    "file": "/images/finnish-lakeland-e320f424.avif",
    "artist": null,
    "licenseName": "Public domain",
    "licenseUrl": null,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Finnish_Lakeland.jpg",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAABwAwCdASoUABAAPu1iqk2ppaQiMAgBMB2JQAAPTfH4TI/GFAAA/rghlsZX6h/3rRY5OikP0Y1AhHmHJIU6EKZTpXkFwAAA"
  },
  {
    "file": "/images/flags-plaza-de-espana-d3622207.avif",
    "artist": "Kmtextor",
    "licenseName": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Flags_Plaza_de_Espana.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAADQAwCdASoUAA0APu1kqk2ppaQiMAgBMB2JagCdABjy2DGAFjKTJTAA/tObi8hKJsI0WIEAHGTW4jSuAwnovWOniUi1Vp2/CYs7pE/gzoSX/ae4TTy3N8AAAAA="
  },
  {
    "file": "/images/forbysibizatown-03-7075bc1d.avif",
    "artist": "Forbfruit at German Wikipedia",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:ForbysIbizaTown_03.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADQAwCdASoUAA8APu1kqk2ppaQiMAgBMB2JZACdACHVzs73pBzhW1AA/dztZxMKDKPwGUM3B3RMG0yKAukxnN7LpJRbnRmyH91OQAAA"
  },
  {
    "file": "/images/frahan-jpg01-d5d4d74e.avif",
    "artist": "Jean-Pol GRANDMONT",
    "licenseName": "CC BY-SA 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Frahan_JPG01.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADQAwCdASoUAA8APu1iqk2ppaQiMAgBMB2JQBajUABpyqyDw3FNDVIA/uAFroIty28RBd4/5UXNddbz8qzuowUhs3nUnlBqZyaxYgAA"
  },
  {
    "file": "/images/frankfurt-am-main-central-business-district-2024-8446cd39.avif",
    "artist": "Dr. Thomas Liptak",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Frankfurt_am_Main,_Central_business_district_(2024).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADQAwCdASoUAAsAPu1iqU2ppaOiMAgBMB2JYwCdAB6WChsDLwEpAAAA/dFmAkh3R8PLXsZjqB1NYJM4PCsyfaTiW9g4I8gJSqAmgAAA"
  },
  {
    "file": "/images/funchal-jardins-da-quinta-vigia-lookout-8a91fdfb.avif",
    "artist": "Dr. Thomas Liptak",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Funchal,_Jardins_da_Quinta_Vigia_(lookout).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADQAwCdASoUAAsAPu1iqU2ppaQiMAgBMB2JaAC06B5jjnu+LRK63gAAx09cpCsaKZ4ftoEepy8ozZhn/ca9jcj3yZK5ZL/ZK8AfvQokWu0/cgAA"
  },
  {
    "file": "/images/galata-tower-turkey-istanbul-city-tourist-attrac-ae269aa3.avif",
    "artist": "Mostafameraji",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Galata_Tower_-_Turkey_-_Istanbul_City_-_Tourist_attractions_-_Monument_01.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADQAwCdASoUAAsAPu1iqU2ppaQiMAgBMB2JZwDA3BjrQK8n4eq3BAAA/uOp4wNcgISUX+2ziblMe5omSLJgBlz4AAA="
  },
  {
    "file": "/images/gaziantep-castle-statues-at-entrance-aslan-bey-a-7fd2cd16.avif",
    "artist": "Dosseman",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Gaziantep_Castle_Statues_at_entrance_Aslan_Bey_and_child_courier_2011_1663.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADQAwCdASoUAA0APu1kq04ppaQiMAgBMB2JZQDA3BuBThwuixZe5gAA/uqQ3CcZeu9Rpu3dv0TMeGmqC8lXKzcLPJvYOZJqYEp00paQPQAAAA=="
  },
  {
    "file": "/images/geirangerfjord-8c43ebcc.avif",
    "artist": "Andreas Trepte",
    "licenseName": "CC BY-SA 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Geirangerfjord_.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAAAQBACdASoUAA0APu1kq04ppaQiMAgBMB2JYgCdACG+LPTi4O0n1tEjQAD+thKTBG8zizjWIKONrN0Ck4nJo5kPtGBu23VdqFhD+Fs18hk4FfNgAAA="
  },
  {
    "file": "/images/geneve-2005-001-ork-ch-80d33229.avif",
    "artist": "fr:Utilisateur:Stéphane_Pecorini",
    "licenseName": "CC BY-SA 2.0 fr",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/fr/deed.en",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Geneve_2005_001_Ork.ch.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACQAwCdASoUAA0APu1kq04ppaQiMAgBMB2JYwCdACHFgQgtwtQAAP5byTw6Hxn7rN7NTr+E6yGcJHW93JdFdBMQlcnKs4kgAAA="
  },
  {
    "file": "/images/gent-de-graslei-vanaf-de-korenlei-met-oeg24758tm-85aa8a7c.avif",
    "artist": "Michielverbeek",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Gent,_de_Graslei_vanaf_de_Korenlei_met_oeg24758tm61%2B25159_IMG_0447_2021-08-13_18.37.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACwAwCdASoUAA0APu1krU6ppaSiMAgBMB2JZQCdAB5N+Fv04J7bmAD+j6IjperUHCWXMyOw0Tkl6hCWKpKWjun5pQH8FvRv0g0AAA=="
  },
  {
    "file": "/images/giethoorn-netherlands-flckr05-d4f2fcbf.avif",
    "artist": "PhotoBobil",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Giethoorn_Netherlands_flckr05.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAACwAwCdASoUAA8APu1kqk4ppaQiMAgBMB2JQBOgAiUFn7wsKLhHgAD+PW8pLKm3Q8gyb3YmxYMQJ/X/M1AngWUtUuZ8UBkVLoqKJbUQUkLXgbBDgAA="
  },
  {
    "file": "/images/gjirokaster-2016-2017-0d80f212.avif",
    "artist": "Name: Armin Flickr: flickr.com/octopuzz/",
    "licenseName": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Gjirokaster_2016-2017.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADwAwCdASoUAA0APu1kq04ppaQiMAgBMB2JZQC7ACHKG7BPyVETgs9AAN5VyYh8j/5ZHoQA/m+kQym/eswGuSaBCYpLxCDTuaiJ0LdQAAA="
  },
  {
    "file": "/images/glasgow-aerial-2025-04-17-14-0e4aecf2.avif",
    "artist": "瑞丽江的河水",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Glasgow_-_aerial_-_2025-04-17_14.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAABwAwCdASoUAAsALrV2u12jqampiYC0SxgE6AEzxwwr0zhDJHgA/Ik8guwhUpR6yTHwNhE69T1fYrD2knlSBGg8YZuyI4iREgAAAA=="
  },
  {
    "file": "/images/gokova-gulf-ec2a6142.avif",
    "artist": "Iemizrak",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:G%C3%96KOVA_GULF.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADQAwCdASoUAA8APu1mq04ppaQiMAgBMB2JQBOgBDrZGlH9iYwcPQAA93CTgJ2TDq51v5CfI0PUs4+gf1rfyRujpP54h3IiZjAV/oIt4bZAAA=="
  },
  {
    "file": "/images/goldswil-viadukt-panorama-mit-interlaken-im-hint-4d4a9aea.avif",
    "artist": "Rectilinium",
    "licenseName": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Goldswil-Viadukt_Panorama_mit_Interlaken_im_Hintergrund_2.jpg",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAADwAwCdASoUAA8APu1iqU2ppaOiMAgBMB2JYgCdAGlHNvi4B07FVxngAP7gC+dnlpRsLwrl8SQ/Dq/cf1GLCN2N10MqKt/5fx+/Or3hOCmzJJz1AwmIAA=="
  },
  {
    "file": "/images/goteborg-2503-stitch-28573994096-3c693e95.avif",
    "artist": "Bengt Nyman from Vaxholm, Sweden",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:G%C3%B6teborg_2503_stitch_(28573994096).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAADwAwCdASoUAAoAPu1iqk2ppaQiMAgBMB2JagCdMoACp6fGU0c/6CCQAP5jujM13dmxHwDWV77dW79oYM1wXA284WaZ8x9RG4oAcDAKTcu2LMGpaq/oAAAA"
  },
  {
    "file": "/images/grand-place-bruselas-2-fe7893e3.avif",
    "artist": "Francisco Conde Sánchez",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Grand_Place_Bruselas_2.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAAAQBACdASoUAAwAPu1kq04ppaQiMAgBMB2JbACdMoMYADM5ck1G4FTFaAD+Uv+TuWa2Bzt2KcIgkUO7hffS/gxCdGkIXEnqpIlIzLTdhK/KlF3x9kl2TH0XyH2L5DqAAAA="
  },
  {
    "file": "/images/graz-35932179023-79be0546.avif",
    "artist": "Nick Savchenko from Kiev, Ukraine",
    "licenseName": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Graz_(35932179023).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACwAwCdASoUAA0APu1iqU2ppaOiMAgBMB2JYwCdACHZqE896ttZDAD+1GQH+qCJLjetXD9+yHZ7oHjDCgIcdIy6IydgTXTEAAA="
  },
  {
    "file": "/images/haarlemgrotemarkt1-65f41ef5.avif",
    "artist": "Fryslan0109 at English Wikipedia",
    "licenseName": "Public domain",
    "licenseUrl": null,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:HaarlemGroteMarkt1.JPG",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAAAQBACdASoUABAAPu1kqU2ppaQiMAgBMB2JZwDCgCG/CV/KQau7bHgkwAD+6u2YwmL3VS7lHm/YirrfWu8jQHsU60zk9uRLXRiTTfQAAAA="
  },
  {
    "file": "/images/hallstatt-zentrum-77eb55f9.avif",
    "artist": "C.Stadler/Bwag",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Hallstatt_-_Zentrum_.JPG",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAAAQBACdASoUAA4APu1orU6ppiSiMAgBMB2JYgCdACICoez0vV31S+bCAADfoJwftTDJ2zgXqJYzJVyp2taVn98p+UkdmDzFwywEPrZec4YAAA=="
  },
  {
    "file": "/images/hamburg-landungsbrucken-2016-3131-7-0426aec8.avif",
    "artist": "Dietmar Rabich",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Hamburg,_Landungsbr%C3%BCcken_--_2016_--_3131-7.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAABQAwCdASoUAA0APu1oqk6ppiQiMAgBMB2JZwAAXBmvySB9AAD+UjMH+uiqsnmW8Gt4Nenr85NV4AJWzeAvMgAA"
  },
  {
    "file": "/images/herceg-novi-sunset-2e0ebd61.avif",
    "artist": "Zlatko at en.wikipedia",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Herceg_Novi_Sunset.JPG",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADwAwCdASoUAA8APu1kq04ppaQiMAgBMB2JYwCdIMgDAs+lvX8d/PaAAP7nrYuTkNEe9g0uWRmT266a6wHT1z1j8tBZQXKNj99kQu8fWEd/04AA"
  },
  {
    "file": "/images/hfbk-dresden-2024-luftbild-toni-klemm-2500px-4ff39731.avif",
    "artist": "Toniklemm",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:HFBK_Dresden_2024_Luftbild_Toni_Klemm_2500px.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADQAwCdASoUAA0APu1qrU8ppiQiMAgBMB2JZQCdACKqwAyalY6/hgwA/udmr9nEFLUvt958giOHX4/cWP1uZc/YguqAJYAA"
  },
  {
    "file": "/images/hoge-der-a-914b3c19.avif",
    "artist": "JAHensens",
    "licenseName": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Hoge_der_A.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRogAAABXRUJQVlA4IHwAAABQBACdASoUABsAPu1mq06ppaQiKA1RMB2JZgC2yA30MsEl1vNwcqTkVxRYAP5GLY0JbQZTCH6TRVM9uTe//ZOymj0B1XkW5U+UDccHVR5TSPzOkx0Qn4+MdCOoSlmkoPLGIkmUtfB9986uZCXi+IDdmzbxXa54fsu+gAAA"
  },
  {
    "file": "/images/horni-nam-sti-olomouc-letecka-fotografie-1-9981faa0.avif",
    "artist": "Lehky.cz",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Horn%C3%AD_n%C3%A1m%C4%9Bst%C3%AD_Olomouc,_leteck%C3%A1_fotografie_1.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACQAwCdASoUAAsAPu1iqU2ppaOiMAgBMB2JZQAAXlntwkuK9hQAAPJhGqTXY3zCk0TlQKEDuUNXUues1+HZ8bsHCckA+zgAAAA="
  },
  {
    "file": "/images/hornocal-687afd13.avif",
    "artist": "Lahi",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Hornocal.JPG",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAACwAwCdASoUAA0APu1iqk2ppaQiMAgBMB2JbACdHX+gcZR+8m5FQAD9QR9HRzrvrs9B4TRvOy0uIghMpZBO9+VmMfCOiV+vww5wgbdbWhc0OIAA"
  },
  {
    "file": "/images/huangpu-park-20124-shanghai-32208802494-35a7ee51.avif",
    "artist": "xiquinhosilva",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Huangpu_Park_20124-Shanghai_(32208802494).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADwAwCdASoUAA0APu1kq04ppaQiMAgBMB2JZgCdMoMjbEGcktfLUazAAP6LAwvQMgO/NfCzX4MANb1TqJM0eC06Bt6AFL4sKl4ws+QA"
  },
  {
    "file": "/images/ibenik-harbour-panorama-ab8b1a8e.avif",
    "artist": "Pudelek (Marcin Szala)",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:%C5%A0ibenik_harbour_-_panorama.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAACQAwCdASoUAAQAPu1iqU2ppaQiMAgBMB2JZQC7AB540HaaAFaAANyAEaJ6H8vm1h0bcczMvngAAA=="
  },
  {
    "file": "/images/island-of-crete-greece-b0124085.avif",
    "artist": "ISS Expedition 28 crew",
    "licenseName": "Public domain",
    "licenseUrl": null,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Island_of_Crete,_Greece.JPG",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAACwAwCdASoUAA0APu1iqU2ppaQiMAgBMB2JZgCdMoRwABZRyH1a4AD+VdpN1+o+2S0x9sXGomGF0SgKCaGN+L1yRpI6IpkeFROoHgAA"
  },
  {
    "file": "/images/jajce-kola-8c3b8157.avif",
    "artist": "Golden Bosnian Lily",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Jajce_(kola%C5%BE).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRn4AAABXRUJQVlA4IHIAAACwBACdASoUABkAPu1mqk8ppaOiKA1RMB2JYwDBzBEZ3MIvjtvDQ0+IqRdpGqGAAPZDnvGyfNaXikf50xs4OI6BxY1qv8f//eE1jgopzF3JtS0utzOFF7lEb3o5gWzIE1mdPPnjobw6+JAdY+cMQ10oAAA="
  },
  {
    "file": "/images/jam-gadang-okt-2020-2-786f0e71.avif",
    "artist": "Rhmtdns",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Jam_Gadang_Okt_2020_2.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADQAwCdASoUAA8APu1iqU2ppaQiMAgBMB2JZgCdACEhpa2xu/dEYlAA9CXsY5rQPveQSYL1mi7VESJvX/vterxg9mmXntuNpQLNPMtwARzxDnS9AAA="
  },
  {
    "file": "/images/jasper-from-the-jasper-tramway-2008-1c0913fd.avif",
    "artist": "Harvey Barrison from Massapequa, NY, USA",
    "licenseName": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Jasper_from_the_Jasper_Tramway_2008.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADwAwCdASoUAA0APu1iqk2ppaQiMAgBMB2JQBOgBFKQPS3+kUtR35GAAP5A9QggtkvCqidFoJPfUfw+CxllvUVeUyQN8Fkj/xhq7OXGAAA="
  },
  {
    "file": "/images/jogja-tugu-monument-2025-img-06-083d5a6f.avif",
    "artist": "Chainwit.",
    "licenseName": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Jogja_-_Tugu_Monument_(2025)_-_img_06.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADQAwCdASoUAA8APu1krU6ppaSiMAgBMB2JZQCw7CHZz9cflO7IywAA/q6b7tbEyUFXAetSchqTBHoaUDlqxiDDFQAAAA=="
  },
  {
    "file": "/images/kaliningrad-05-2017-img07-fishery-village-a1d0f00f.avif",
    "artist": "A.Savin",
    "licenseName": "FAL",
    "licenseUrl": "http://artlibre.org/licence/lal/en",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Kaliningrad_05-2017_img07_Fishery_Village.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAABwAwCdASoUAAsAPu1orU2ppqSiMAgBMB2JYwCdACHWHQ4ZuOAA91tytKG7okaZkTmWRrZBQYqQ2a1OylSTaUwOAAA="
  },
  {
    "file": "/images/karlovy-vary-czech-c9203ed0.avif",
    "artist": "Jialiang Gao, www.peace-on-earth.org",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Karlovy_Vary_Czech.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAABQAwCdASoUAA0ALrV2u12jqampiYC0SgC06C94jO6/MaSqAAD+7L6hmXcyfZJavJpGxDHmYChHGaaeDJEZ0rS8+zv30s0PWMUF+ZyVogAAAA=="
  },
  {
    "file": "/images/kathedrale-von-palma-01031642.avif",
    "artist": "Thomas Wolf, www.foto-tw.de",
    "licenseName": "CC BY-SA 3.0 de",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/de/deed.en",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Kathedrale_von_Palma.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAABwAwCdASoUAAsAPu1iqk2ppaQiMAgBMB2JZgCdADKEwr82sgAA/rn9UDfnIkbUiVhGxurSS71weQENQR9pWyMayU8VtFUAAAA="
  },
  {
    "file": "/images/kaunispaa-e4d10d94.avif",
    "artist": "M.P., User:Argus_fin",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Kaunisp%C3%A4%C3%A4.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAABQAwCdASoUAA8APu1krU2tJaSiMAgBoB2JZgC06GYFfMNcgAD+tR710d8h4M4ONxV4qPbx/i4p+0A3ezutDkWxChkP9uJSRc+JAmAAAAA="
  },
  {
    "file": "/images/kawah-ijen-27432832286-483efd71.avif",
    "artist": "BxHxTxCx (using album)",
    "licenseName": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Kawah_Ijen_(27432832286).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADQAwCdASoUAA0APu1mq04ppaQiMAgBMB2JQBOgBDrswmxpu1yEMQAA8KGqI9tHobSgaZyiWNXKPagH4u2ujp8KNJpQ8s8kgl6PAAAA"
  },
  {
    "file": "/images/ke-te-kesu-1-8656a937.avif",
    "artist": "Jorge Franganillo",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Ke%27te%27_Kesu%27_1.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAACQAwCdASoUAAwAPu1iqU2ppaOiMAgBMB2JZACsAA6tBb1+gtvAAP45bimPgAjeMuVdV2rRPLe3uHOPBwWy3o1E6l/SYAAA"
  },
  {
    "file": "/images/kiruna-september-2017-01-e6941236.avif",
    "artist": "Arild Vågen",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Kiruna_September_2017_01.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAABQAwCdASoUAA0APu1iqk4ppaQiMAgBMB2JYwCdACzboQ7qgAD+zSBYMBA3HD9YvUT38qceGMwGpwoH6pcZyAAA"
  },
  {
    "file": "/images/krakow-rynek-glowny-panorama-2-730b1557.avif",
    "artist": "Andrzej Otrębski",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Krakow_Rynek_Glowny_panorama_2.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACQAwCdASoUAAoAPu1qrU8ppiQiMAgBMB2JQBOgBEAAzFDU5OngAP0+hVrWDy0J3eJY1AUPGfJbBOOzwdw7mrdlX1NQI8POAAA="
  },
  {
    "file": "/images/kranhauser-cologne-april-2018-01-841791d0.avif",
    "artist": "Martin Falbisoner",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Kranh%C3%A4user_Cologne,_April_2018_-01.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAACwAwCdASoUAAsAPu1iqU2ppaOiMAgBMB2JZwCsACIGwNouuL9yAADLDibMD9ec82hYHpfIc74lJp2MWvkAAA=="
  },
  {
    "file": "/images/kranjska-gora-2736048-9cfbc87e.avif",
    "artist": "benj500",
    "licenseName": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Kranjska_Gora-2736048.jpg",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAABQBACdASoUAAsAPu1iqU2ppaOiMAgBMB2JZACdL1yBo5DnyC9Wl12nUYvAAPZC+btPc15KgxP5IPWKPphHau+fbbZ+sE0iYs8NyCZBw7P8AAAA"
  },
  {
    "file": "/images/kruje-krujaalbania-2016-c5c65120.avif",
    "artist": "Photo: Chris Walts",
    "licenseName": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Kruj%C3%AB-KrujaAlbania_2016.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAAAwBACdASoUAA0APu1iqk2ppaQiMAgBMB2JQBOmUABeCpLlZRau0cogoaAA/oLD+Cqa7ZsTYdFE3of3ShmYn+zzfnMTUoW84Qk+xIlsPgsQEKgWc9zO1YvOmXBjmuAA"
  },
  {
    "file": "/images/kutna-hora-003-db48d813.avif",
    "artist": "al.trcka",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Kutn%C3%A1_Hora_(003).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACQAwCdASoUAA8APu1iqk2ppaQiMAgBMB2JZQDE2CHSEwFeepC4AP7qyT42Y77k6VxixufHbLmUu9EvGQP+TixFcSxszZLgCeAAAA=="
  },
  {
    "file": "/images/labuan-bajo-a-port-in-west-flores-nusa-tenggara--5e454968.avif",
    "artist": "Tiket2",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Labuan_Bajo,_a_port_in_West_Flores,_Nusa_Tenggara,_Indonesia;_January_2020.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAAAQBACdASoUAA0APu1mq04ppaQiMAgBMB2JagCdMoMYAC+LU8j4zySWAAD9Qlk/zP5JoYJyCJH660uP7UDgxup9Hhg39ipBD/KiqLOz+pacrWNaks8AAA=="
  },
  {
    "file": "/images/laineensaari-from-shore-of-papinniemi-in-parikka-c4339fc0.avif",
    "artist": "Ximonic (Simo Räsänen)",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Laineensaari_from_shore_of_Papinniemi_in_Parikkala,_South_Karelia,_Finland,_2022_June.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAACwAwCdASoUAA0APu1iqU2ppaOiMAgBMB2JYwCw7B01vOHplAVUAAD6lA5Sjx0/4wpiPjS6jtbmKth50x1e+QjdR+1OnAAA"
  },
  {
    "file": "/images/lake-bled-from-the-mountain-333242e7.avif",
    "artist": "Canadianhockey91",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lake_Bled_from_the_Mountain.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAADwAwCdASoUAA8APu1mq04ppaQiMAgBMB2JagCsL14UAAwJmwB1dU3uAP5ZNFnAR694163LKfsxfOTuuNhFTqXeGtL/AMpPbTzsVeW7oOxR66csLgOZKzygcf2Kkx38AAA="
  },
  {
    "file": "/images/lake-toba-and-the-surrounding-hills-86271b03.avif",
    "artist": "Bisajunisa",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lake_Toba_and_the_surrounding_hills.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACQAwCdASoUAA0APu1iqk2ppaQiMAgBMB2JQBOgAqsBVR725u1gAPeg3h9h+tzku5g5D7Ir2sjZB/dgBgtigB66XONoGLZSZ8AAAA=="
  },
  {
    "file": "/images/land-s-end-cornwall-uk-coast-path-2013-1061-8783bcd2.avif",
    "artist": "Dietmar Rabich",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Land%27s_End_(Cornwall,_UK),_Coast_Path_--_2013_--_1061.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAAAwBACdASoUAA0APu1iqk2ppaQiMAgBMB2JYgCdMoADVV+fFYM9KhAO7gAA/TAENLEgv/Yzab+2Fcx4U9rR+W2NxayGIlTYyb23rXDtrPAzXGBaAAA="
  },
  {
    "file": "/images/lausanne-wiki-c0d2eea6.avif",
    "artist": "File:Musee olympique.jpg: Arnaud Gaillard (arnaud () amarys.com) File:Cathédrale de Lausanne depuis le Champ de l'Air.JPG: Gzzz File:Federal Supreme Court of Switzerland.jpg: Roland Zumbühl. Original uploader was Hagelhans at de.wikipedia File:Lausanne img 0585.jpg: Rama Composition: Noldo18",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lausanne_Wiki.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRoIAAABXRUJQVlA4IHYAAABQBQCdASoUABkAPuVepk2pJSOiN/VYASAciWMAxNgQOeyE2w3j0lbOMH8p4cG2Ezpg/4AA/qvI0ipkViYg6w4H/f0rjJ5vIlpLYLCIiwVKTmS7GSpvqEK0oHcLHVhu8tGDp5D/c3sf0vwwjEAjDOE8vjHgAAAA"
  },
  {
    "file": "/images/lencois-maranhenses-2018-7007c63d.avif",
    "artist": "Julius Dadalti",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Len%C3%A7%C3%B3is_Maranhenses_2018.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRqAAAABXRUJQVlA4IJQAAABQBQCdASoUABsAPu1gqE6ppSOiMBgMATAdiWQAnTMy8xgkJW67soHwS0oHM15io85fhwAA/UGSkzdsqtuNBOeyz8OE1YLxt4KSUw/I36uYHQBSvYvxUi+NMXTj0k5isuqYdNk5piul/NZ3+ZafzErt9Ly/ZnesHjS47hu5INA/Hmbyg12h7ARoRAxkimGhaTCmYAAA"
  },
  {
    "file": "/images/lichttoren-eindhoven-1-cropped-980d9213.avif",
    "artist": "Rosemoon",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lichttoren_Eindhoven_1_-_Cropped.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAACwAwCdASoUAA0APu1iqk4ppaQiMAgBMB2JZgCdL1yBO817fSvCAADJwK9N8zH0Teuk54PQg3HXn7QEV9e+rHiBuh/nLH3EOH0sdJc3rxHsXgAA"
  },
  {
    "file": "/images/liege-view-03-5b0deed6.avif",
    "artist": "A.Savin",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Liege_View_03.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAACwAwCdASoUAA0APu1orU6ppiSiMAgBMB2JQBOgA9DQzYKwZtboGAD90kPj7Td0BZ7sk7oQ8aCEzopNzDH60zf9aK5lqSSs6Fc1KgAA"
  },
  {
    "file": "/images/linz-blick-von-freinbergstrasse-32-2-cropped-09ffa488.avif",
    "artist": "Radler59 (talk)",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Linz_Blick_von_Freinbergstrasse_32-2_(cropped).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADQAwCdASoUAAoAPu1iqU2ppaOiMAgBMB2JZgCdL1yBoSTeqmu/CsgA/dlOFuayjO7RaZ7F8yAW+9C4HgRc1E8IXdEvnBJt3MAAAA=="
  },
  {
    "file": "/images/lisboa-portugal-52597836992-1491b93a.avif",
    "artist": "Vitor Oliveira from Torres Vedras, PORTUGAL",
    "licenseName": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lisboa_-_Portugal_(52597836992).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAAAQBACdASoUAA0APu1kqU2ppaQiMAgBMB2JYgCdMoMYAEmAy+rHlzj9AAD+Uq3K7vyMwAEKz0qLJTB4X2IQSeWSNxqvNpDJib5US7TRriH4AA=="
  },
  {
    "file": "/images/liverpool-mersey-waterfront-and-skyline-geograph-7b4793c2.avif",
    "artist": "Peter Evans",
    "licenseName": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Liverpool_Mersey_Waterfront_and_Skyline_-_geograph.org.uk_-_3675287.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAABQAwCdASoUAAgAPu1Ct1apoqakGAEwHYlnAABdAOzEK+qgAAD+xKDT4Cv2aUqZDpYol4Ol5gegAA=="
  },
  {
    "file": "/images/ljubljana-old-town-slovenia-old-camera-332861656-e6810133.avif",
    "artist": "Andrew Milligan Sumo",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Ljubljana_Old_Town,_Slovenia_(Old_Camera)_(33286165680).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAADwAwCdASoUAA8APu1iqk4ppaQiMAgBMB2JZACdMoMljDrL9DafeQJcAP6yMUSunqUT0WQTnpzLp/dMTvNGymEUKaiMXL90EhbfhK7lyfsZmwwY7Twov0bKlwAAAA=="
  },
  {
    "file": "/images/london-westminster-skyline-f5a804e1.avif",
    "artist": "reverendlukewarm",
    "licenseName": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:London_Westminster_Skyline.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAACwAwCdASoUAAkAPu1mqk2ppaQiMAgBMB2JYwCdAB6JHI/uh9uRAAD8cyLEOj9A6e1lE8RGAr//rr+eTs06u/RTu5APFQAA"
  },
  {
    "file": "/images/longyearbyen-spisshus-2022-e290d300.avif",
    "artist": "Bjørn Christian Tørrissen",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Longyearbyen-spisshus-2022.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAABQAwCdASoUAA4APu1kqU2ppaQiMAgBMB2JQBOmUGMAA4RPyAD8SvUNK5dSUqzUPZw+/yGEkUPmJv4tX+TrqED7K1EM6uc+oXs54EgAAAA="
  },
  {
    "file": "/images/lublin-panorama-b8162bdf.avif",
    "artist": "Kanion",
    "licenseName": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lublin_Panorama.jpg",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADQAwCdASoUAA8APu1iqU2ppaOiMAgBMB2JYwCdACHWvx+8oLKGrAAA/d4VGtnCv6+WVQgbKdI+xsHjbSPh+9sHFePkak/0IFlNAAAA"
  },
  {
    "file": "/images/maastricht-sunset-65800652.avif",
    "artist": "Bert Kaufmann",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Maastricht_sunset.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAACwAwCdASoUAA0APu1mq04ppaQiMAgBMB2JZQAAYcIw5z0YWdumAAD9/HyI+AMprLKEt0JZYwVooPvQnBFKHYnpZ8Ra96sGH0g1Kk6AAAA="
  },
  {
    "file": "/images/madalena-do-pico-panoramio-8-563aa45b.avif",
    "artist": "JCNazza",
    "licenseName": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Madalena_do_Pico_-_panoramio_(8).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACwAwCdASoUAA0APu1krU6ppaSiMAgBMB2JQBYdhDrefKP9N/jzAAD+UXyZDHT96O7sXn8ZHyWNQF3MNELGP7Fn/nIUxAqvAAA="
  },
  {
    "file": "/images/madrid-sky-bar-360-hotel-riu-plaza-espa-a-vistas-b5ea0f31.avif",
    "artist": "Zarateman",
    "licenseName": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Madrid_-_Sky_Bar_360%C2%BA_(Hotel_Riu_Plaza_Espa%C3%B1a),_vistas_19.jpg",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADQAwCdASoUAAsAPu1qrU8ppiQiMAgBMB2JYwCdMoADTpJ96FoRdgAA/G6DlS/y9zftujtOAGI6tnZ4lgJv3SBjzKuVwAAA"
  },
  {
    "file": "/images/makassar-march-2019-cropped-d8b90298.avif",
    "artist": "Bluesatellite",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Makassar,_March_2019_(cropped).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAACwAwCdASoUAAsAPu1kq04ppaQiMAgBMB2JZwAAW2805meaDg4ggAD+xRPEGBXAq2zq+ddT7xJiNFTIpVGauKBdIQLhvwAA"
  },
  {
    "file": "/images/malmo-flygbild-06-september-2014-765fca60.avif",
    "artist": "This image was produced by me, David Castor (user:dcastor). The pictures I submit to the Wikipedia Project are released to the public domain. This gives you the right to use them in any way you like, without any kind of notification. This said, I would still appreciate to be mentioned as the originator whenever you think it complies well with your use of the picture. A message to me about how it has been used would also be welcome. You are obviously not required to respond to these wishes of mine, just in a friendly manner encouraged to. (All my photos are placed in Category:Images by David Castor or a subcategory thereof.)",
    "licenseName": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Malm%C3%B6%E2%80%93flygbild_06_september_2014.jpg",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACQAwCdASoUAA0APu1iqU2ppaOiMAgBMB2JZQAAW8+4x4pPdIOAAP7f7Kkuxe2WVdMIMjVCGj+bRDUxp/F0kHChSRtmr12AAAA="
  },
  {
    "file": "/images/malvarrosa-beach-valencia-spain-29812271043-da48578f.avif",
    "artist": "Boris Dzhingarov",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Malvarrosa_Beach,_Valencia,_Spain_(29812271043).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAACwAwCdASoUAAsAPu1iqk2ppaQiMAgBMB2JZQC/OBKPnPAGlYxuAAD9cFB61RR1YFOKiNRMCfZV6zBWMZ26DIvhHUNpCzjW7/dxO5wA"
  },
  {
    "file": "/images/manaus-amazonas-4f09dd98.avif",
    "artist": "Arne Müseler",
    "licenseName": "CC BY-SA 3.0 de",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/de/deed.en",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Manaus_amazonas.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAACwAwCdASoUAAsAPu1Ct1apoqakGAEwHYllALsAFk3NW0SMsjDZAAD6LQLqYkifNU4RC3FWQVgbIc0gYBEcQB8g7kIRvQAA"
  },
  {
    "file": "/images/manchester-east-panorama-geograph-org-uk-3099838-35cdbfe3.avif",
    "artist": "David Dixon",
    "licenseName": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Manchester_East_Panorama_-_geograph.org.uk_-_3099838.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAABwAwCdASoUAAMAPu1kqk2ppaQiMAgBMB2JZwCdAB4+m3EFjMAA/iXhrtuYwFbzJ+rv9pafnlQAAA=="
  },
  {
    "file": "/images/mardin-mardin-merkez-mardin-turkey-panoramio-1-60fe25ca.avif",
    "artist": "Ben Bender",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Mardin,_Mardin_Merkez-Mardin,_Turkey_-_panoramio_(1).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADQAwCdASoUAAsAPu1orU2ppqSiMAgBMB2JbACdMoADTJnZDRsqLeAA/T6mhzcqn/P29dXwCVw7M3sH2BGNtbchVm+dMtrbGtuvUCM7Fg/RgAAA"
  },
  {
    "file": "/images/marginal-pinheiros-e-jockey-club-4613a063.avif",
    "artist": "Agent010",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Marginal_Pinheiros_e_Jockey_Club.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADQAwCdASoUAAkAPu1kqk2ppaQiMAgBMB2JYwCdIKnDAQo1hq1Ps+wA3lFZNXSXxfZhtcKwvjNDZKDW//C8Pxkd9LgAAA=="
  },
  {
    "file": "/images/mariborski-glavni-trg-ac83107a.avif",
    "artist": "Vlada Republike Slovenije",
    "licenseName": "Public domain",
    "licenseUrl": null,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Mariborski_Glavni_trg.jpg",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADwAwCdASoUAA0APu1qrU8ppiQiMAgBMB2JYgCdAB9gOjyspciB/vOAAM0S7qq5YsE9zMxGKQcytIEiEjHlCqRuqPfEBYKWZ7yExhkt9uAAAA=="
  },
  {
    "file": "/images/mariehamn-harbor-1-256f53e9.avif",
    "artist": "kallerna",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Mariehamn_harbor_1.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAADQAwCdASoUAAoAPu1oqk6ppiQiMAgBMB2JYwCdMoADPQ9n0uJ5vIAA/lct4/KJVljlSqbGinItthuiC2WIgAAA"
  },
  {
    "file": "/images/marmaris-castle-a6b0d53f.avif",
    "artist": "Dave.Dunford at English Wikipedia",
    "licenseName": "Public domain",
    "licenseUrl": null,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Marmaris_Castle.jpg",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADwAwCdASoUAA8APu1iqk2ppaQiMAgBMB2JYgCdACGm8Dx6iQQOww9AAP6QDTtK1yexWqHyLvNFHVWUmgxRRj+6QrIZg/oxKNa+bsICKy+IawAA"
  },
  {
    "file": "/images/maulana-jelaledin-muhammad-rumi-in-konya-d76bb837.avif",
    "artist": "Emad Nemati",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Maulana_Jelaledin_Muhammad_Rumi_in_konya.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAADwAwCdASoUAA0APu1iqU2ppaOiMAgBMB2JbACdAB6JSvu4k7/Qpy0AAP7w32RiotTCh4pJS2JJAbxh9u9l4PfAvU7bHTWcFWDIhPeeS1y9FHGAtjGZdaAGoAxnf3mAAAA="
  },
  {
    "file": "/images/medialuna-real-bath-inglaterra-2014-08-12-dd-58--2a05bbbf.avif",
    "artist": "Diego Delso",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Medialuna_Real,_Bath,_Inglaterra,_2014-08-12,_DD_58-61_PAN.JPG",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAAAQAwCdASoUAAQAPu1iqU2ppaQiMAgBMB2JQAALcrfxQAAA/eNXLToEUxHf8ExvWqbNuJwbDZ8DV0dfAAA="
  },
  {
    "file": "/images/meteora-s-monastery-2-0e94e918.avif",
    "artist": "Stathis floros",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Meteora%27s_monastery_2.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAACQAwCdASoUAA0APu1iqk2ppaQiMAgBMB2JZQAAYdHeYOCLYFJAAP6OHx7Zq481rmPQI3jaQk5Dp8gXaixsZ/1zPn6iAAAA"
  },
  {
    "file": "/images/mitrovac-na-tari-39025167.avif",
    "artist": "Original uploader was sr:Корисник:Goldfinger at sr.wikipedia",
    "licenseName": "CC BY 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.5",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Mitrovac_na_Tari.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAABwAwCdASoUAA8APu1mqk2ppaQiMAgBMB2JQBOgBDqjetPVNQAA/u1xAOIBweQatukaY/BBiIjFPG1UmN93TVlqX9P3dwk8AAA="
  },
  {
    "file": "/images/montealbanwest-b42308f7.avif",
    "artist": "No machine-readable author provided. João Sousa assumed (based on copyright claims).",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:MonteAlbanWest.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADQAwCdASoUAA8APu1oqk6ppiQiMAgBMB2JYgCdABt7KGATFrQONgAA8ZdmSILI9WuKd+mzuFBsFUrNy65hZ3kFvtB6Nv59mPHwAl5QAAA="
  },
  {
    "file": "/images/montreal-quebec-skyline-8385704d.avif",
    "artist": "Quintin Soloviev",
    "licenseName": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Montreal,_Quebec_skyline.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADQAwCdASoUAAwAPu1qrU8ppiQiMAgBMB2JYgCdGuAAUTPG+uR6K+gA/dlLsPNcy6Y4pS4ICnIux36keGqgTdjMX1f+DFQ+qDmAAA=="
  },
  {
    "file": "/images/morro-da-cruz-florianopolis-sc-brazil-panoramio--f617ad54.avif",
    "artist": "oscar fava",
    "licenseName": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Morro_da_Cruz,_Florian%C3%B3polis_-_SC,_Brazil_-_panoramio_(cropped).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACwAwCdASoUAAoAPu1mqk2ppaQiMAgBMB2JQBOgBEA7qirmNtLvMAD8a0GkOcXy3qxLsNa4shRdcwkpc8RYxgfB5D0sZfkgAAA="
  },
  {
    "file": "/images/moskenes-reinebringen-lub-2025-07-21-img09-aussi-e468f2c7.avif",
    "artist": "Lukas Beck",
    "licenseName": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Moskenes_Reinebringen_lub_2025-07-21_img09_Aussicht.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACwAwCdASoUAA0APu1orU2ppqSiMAgBMB2JQBOgBHn/77xNYIhAwAD+dGrajJr+tclEaNQhoi4QxMgOFB7LuIOQyfXlLHdWVj8AAA=="
  },
  {
    "file": "/images/murmansk-cropped-7cbe1b19.avif",
    "artist": "Tom Thiel",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Murmansk_(cropped).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADwAwCdASoUAA8APu1iqU2ppaOiMAgBMB2JYgCxC8ADAnelSDGMhHeAAPKZTu4Jwj7qFNm2n86eDuim3TEuUXV0588+yHgWSAA="
  },
  {
    "file": "/images/museumsinsel-berlin-juli-2021-1-cropped-b-73e7d357.avif",
    "artist": "File:Museumsinsel Berlin Juli 2021 1 (cropped).jpg: Kasa Fue derivative work: Georgfotoart",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Museumsinsel_Berlin_Juli_2021_1_(cropped)_b.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAACwAwCdASoUAAwAPu1iqk2ppaQiMAgBMB2JYwCdACHWTD6kh8sgAAD94lmltDT5sIXAULgqSdOtvB2ogPCQtyFBks/Klg1bF7mIAAAA"
  },
  {
    "file": "/images/nanjing-cbd-from-city-wall-6e46d7f6.avif",
    "artist": "xiquinhosilva",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Nanjing_CBD_from_City_Wall.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADQAwCdASoUAA0APu1iqU2ppaQiMAgBMB2JaACdACIF4OuUCZ1bSQgAyn5D9Y8ttkccShkSifWhq6jL2WX+DcR40jG8isk56TSgQK/YAAA="
  },
  {
    "file": "/images/nationaltheatret-evening-9a414405.avif",
    "artist": "Orjanarvola",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Nationaltheatret_evening.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAABQAwCdASoUAA0APu1iqU2ppaOiMAgBMB2JZwAAKmEEAnF8gAD+2YxY5MeQe1D00FVOcr8faTA91+ABNIAAAA=="
  },
  {
    "file": "/images/niagara-falls-ontario-canada-aerial-view-a0ca20d9.avif",
    "artist": "Salwa Farwaneh",
    "licenseName": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Niagara_Falls_Ontario_Canada_aerial_view.jpg",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACwAwCdASoUAA0APu1mq04ppaQiMAgBMB2JQBYdhDrvvNmdP0RKBAD+3rct/5NfUp6IsAH6yuq/VbQLsmIv6EgbLFzLSLk0+wAAAA=="
  },
  {
    "file": "/images/njego-ev-mauzolej-ddc9b1bc.avif",
    "artist": "photo by Darko Bulatovic",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Njego%C5%A1ev_mauzolej.JPG",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAACwAwCdASoUAA0APu1kqk4ppaQiMAgBMB2JYgCdL1yALLemCSw4AADdmvd2MNJfvA8V8Iv2itS6lOnyMa1TNxy6zxfCfACLDjIGS7y2IA++12P7gAA="
  },
  {
    "file": "/images/nkd115-saborna-crkva-hrista-spasitelja-banja-luk-7b259a6b.avif",
    "artist": "Tomas Damjanovic Banjaluka",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:NKD115_Saborna_crkva_Hrista_spasitelja_Banja_Luka_RS_BiH.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAABwAwCdASoUAAsAPu1krU2ppaSiMAgBMB2JQBdgAVXsSHHihoAA5m+/bZYHE9ditRyHhG5eOZK8cpjdxu3DqRAA"
  },
  {
    "file": "/images/nurnberger-burg-im-herbst-2013-8a9b1918.avif",
    "artist": "DALIBRI",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:N%C3%BCrnberger_Burg_im_Herbst_2013.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACwAwCdASoUAA0APu1iqk2ppaQiMAgBMB2JZACdAB6FYnoCN18NQAD8XIIsa5khptu9bgZnTYZe0mtCIutNbEDNnktmmYGEAAA="
  },
  {
    "file": "/images/ny-lesund-town-and-mine-museum-4b8593ab.avif",
    "artist": "In Vitrio",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Ny-%C3%85lesund_Town_and_Mine_Museum.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADwAwCdASoUAA8APu1kqU2ppaQiMAgBMB2JYwCzgCILZ6h1hpPMrO+gAP2aNFlUQ4n8guY+teOdU75FboxO8HDg8rjLgQ7hVGWZvi+u8aFMQAAA"
  },
  {
    "file": "/images/odense-sankt-knuds-kirke-2005-07-16-173c1d4d.avif",
    "artist": null,
    "licenseName": "Public domain",
    "licenseUrl": null,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Odense_-_Sankt_Knuds_kirke_2005-07-16.jpeg",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRoYAAABXRUJQVlA4IHoAAADwBACdASoUABsAPu1mrVAppSQisBgIATAdiWUAw3APR2fjiaCihNg+GH8VeqHUKgAA9r6fimlZtym0luLTxJCTYScuru8zODN6PgWmdXUhCrkp3oe67UcHCwEczTFhCLP3oor7nbyGDnjxUvOEGCNTnI2MHJKpn8AAAA=="
  },
  {
    "file": "/images/p064720-426794-panoramic-view-of-podgorica-2bc6540c.avif",
    "artist": "Savo Prelevic",
    "licenseName": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:P064720-426794_-_Panoramic_view_of_Podgorica.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAAAQBACdASoUAA4APu1iqk2ppaQiMAgBMB2JZQCdABhotOyU4DqpVoOVAADNimdI3/4r6Mv87yCsEFg0Y4sK6gBCOmUEvrxk+9PpInOSAAA="
  },
  {
    "file": "/images/palacio-de-estoi-portugal-8291585643-cropped-3dca25e1.avif",
    "artist": "Vitor Oliveira from Torres Vedras, PORTUGAL",
    "licenseName": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Pal%C3%A1cio_de_Est%C3%B3i_-_Portugal_(8291585643)_(cropped).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAABQBACdASoUAA4APu1kq04ppaQiMAgBMB2JZgCdMoLT/uxgJpHvJdNwGphgAMqR+SfgwMhOw4ijHnYfC3JQ+77tYYdJhCoUd+GCa+X0AqBCTYarLK+VrgAA"
  },
  {
    "file": "/images/pan-i-ev-vrh-during-winter-f4edf9b1.avif",
    "artist": "Ratko Bozovic",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Pan%C4%8Di%C4%87ev_vrh_during_winter.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAACwAwCdASoUAA8APu1iqk2ppaQiMAgBMB2JQBOmUABMDcR0W4m3sAD+ln0MMWHgw26oMQIWkE0QqmHhbvjTWf3ql0ypQ78Jmj2Apsoa4AA="
  },
  {
    "file": "/images/panorama-belgrad-b67d8641.avif",
    "artist": "ZlatanJovanovic",
    "licenseName": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Panorama_Belgrad.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAADQAwCdASoUAAsAPu1qrU8ppiQiMAgBMB2JZQC7ACHXbC2sWNQGxAAA3hJLFgPDNgj16NawhMPxNF4oJo08MAAA"
  },
  {
    "file": "/images/panorama-from-tower-brasenose-college-oxford-geo-2db97f6c.avif",
    "artist": "Christine Matthews",
    "licenseName": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Panorama_from_Tower,_Brasenose_College,_Oxford_-_geograph.org.uk_-_4502199.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAACQAwCdASoUAAMAPu1iqk4ppaQiMAgBMB2JZwAAQrd4S8oTFo2AAM3ap5S1K/lOURccMrxqViO3t3iAAAA="
  },
  {
    "file": "/images/panorama-of-balloons-in-flight-goreme-cappadocia-14e00f51.avif",
    "artist": "Adam Jones from Kelowna, BC, Canada",
    "licenseName": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Panorama_of_Balloons_in_Flight_-_Goreme_-_Cappadocia_-_Turkey_-_01_(5761020929).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAACwAwCdASoUAAQAPu1iqU2ppaQiMAgBMB2JYwC7ACHfJyehUsa4AAD+g/YRZcMfGoZximFn1oa1OetOFwdEQAAA"
  },
  {
    "file": "/images/panoramic-view-of-oia-santorini-island-thira-gre-3ef48a6b.avif",
    "artist": "Mstyslav Chernov",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Panoramic_view_of_Oia,_Santorini_island_(Thira),_Greece.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAAAQBACdASoUAAgAPu1orU2ppqSiMAgBMB2JZQCdAGjww+GskOcOw3mPMAD+xOzbq7fFufITl3IUyczLwevEfYRczy9flVBw8WAAAA=="
  },
  {
    "file": "/images/panoramica-guadalajara-desde-edificio-bansi-haci-2ef71995.avif",
    "artist": "Isacdaavid",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Panor%C3%A1mica_Guadalajara_desde_edificio_Bansi_hacia_norte_(cropped).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAACQAwCdASoUAAoAPu1iqk2ppaQiMAgBMB2JQBOgBFSIkwhxUWmAAP5WaDFhCrYRpcMFLu51FytEJE12vgZGGYLG7AA="
  },
  {
    "file": "/images/pecs-montage-3a9841d0.avif",
    "artist": "Imoti95",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:P%C3%A9cs_Montage.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAADQBACdASoUABUAPu1qqlAppiOiqA1RMB2JYwCdMt8BXNZVIyISX9Pbngx3RrRowAD+YAT7g9D+Y1t59rdYzGTDs7QS0raiVSeWqzyUhbZu5JVtsEtrcnnZGW1UHw0sIlB4QpDj/K69H6zJdOAAAA=="
  },
  {
    "file": "/images/pejzaz-ribnickog-jezera-2ef74b8d.avif",
    "artist": "Ivanbuki",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Pejzaz_ribnickog_jezera.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADwAwCdASoUAA0APu1mqk2ppaQiMAgBMB2JYgCxDIjCc6LHBs/Zyn3cAPpuNP4+VUphw6W6T1vZYtZ6uqbD6ID0MTBp8J9Lb0JTRO5B+s9mqdesgAA="
  },
  {
    "file": "/images/perast-100-301d9213.avif",
    "artist": "FrDr",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Perast_100.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAACQAwCdASoUAA0APu1kqU2ppaQiMAgBMB2JYwCw7CHGk99H5GgAAPdm46I9XJgQ/F7jf2n/ZEOEQ2vtoo6bl0G4bZM07QAA"
  },
  {
    "file": "/images/photo-1467269204594-9661b134dd2b-f10dca76.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADwAwCdASoUAA0APu1oqk6ppiQiMAgBMB2JYwC+aDZC/5AIFClLhSmAAP4IxZmMcWE4GvXIkSfMqytJxZ/0p5MxVDo0KFPzSliIvC6V+WRtY+wAAAA="
  },
  {
    "file": "/images/photo-1491166617655-0723a0999cfc-b656b2a4.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1491166617655-0723a0999cfc?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADQAwCdASoUAA0APu1krU6ppaSiMAgBMB2JYwCw7CHag9hrV2N+7PAA/t6tOTNzVIwLt493N5lbyumHKK4EbQAnqkvVNxbrRAG+vg8prdCiAA=="
  },
  {
    "file": "/images/photo-1493976040374-85c8e12f0c0e-9fc55608.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAAAQBACdASoUAA0APu1kqk4ppaQiMAgBMB2JQBOmUABJmxUJ8j49pwlBcAD+wiv9ge74kiXqrvFD0hYvmE3DUZFhpfHOFUSlwq8YSMpdc1bltwAA"
  },
  {
    "file": "/images/photo-1494522855154-9297ac14b55f-19cada2a.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAACQAwCdASoUAA0APu1qrU8ppiQiMAgBMB2JQBdgBBuT6mbTsd/4AP7rIhrDg4r1F220fCedpuyrUBFhc9bQEcpjRwiDdWd5dK5bEOKLwOqmc6rtLgUAAA=="
  },
  {
    "file": "/images/photo-1496442226666-8d4d0e62e6e9-fd1b58b1.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAACQAwCdASoUAA0APu1iqk2ppaQiMAgBMB2JYwCsABjDrFw09XggAP7o6asOiN13OIxGv3cY6QkUbgtBR068WSRJEZIvOcK8DFjV1UugAAA="
  },
  {
    "file": "/images/photo-1501594907352-04cda38ebc29-712dcb91.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAACwAwCdASoUAAsAPu1kqk4ppaQiMAgBMB2JQBOmUABWFmnCzktrQAD99modxz6NMcdtCwibCf2uBIBwTETzHLUwLB13mwAA"
  },
  {
    "file": "/images/photo-1502602898657-3e91760cbb34-2d7d3222.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAAAQBACdASoUAA0APu1iqk2ppaQiMAgBMB2JYwCdMoMjbEmWaHbXGNBg0AD+u8n9UOPzy7A+NbOybK91eKTBHGt39aptvmltvECSnD/dtMeiXtoAAAA="
  },
  {
    "file": "/images/photo-1508009603885-50cf7c579365-6c1a61b5.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAADQAwCdASoUAA8APu1iqU2ppaOiMAgBMB2JZgCw7CP5vppPU6BPmwAA/uzd/lJ3N4K2qk7IRNhRGwkGkrj1JbOC9mM6NOkJL/fGi0TdiYaG+Q2lY8icr8MbEm8No1mAAAA="
  },
  {
    "file": "/images/photo-1516483638261-f4dbaf036963-7f811b36.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRoAAAABXRUJQVlA4IHQAAADQBACdASoUAB4APtVgo02oJiMiN/qoAQAaiWYArAAfUrf0ArioBUHk6Gh/c0RgAAD+lOB9M4HgLtzoOsJi2FEvFR+EgWia3lvtmD3GIAcjdMxPdZceHqtudUimLd0ibVKdi4wxs0FVUZ14vKvqcX6+i4AAAA=="
  },
  {
    "file": "/images/photo-1520440229-6469a149ac59-a2989cad.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1520440229-6469a149ac59?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAACQBACdASoUABsAPu1qrlCppaQiqAqpMB2JYwAAKdn8iPt2b/CP/AkQcpAPJYAA/dJDytKJwxsOSG/VXS6H3JEv7auX1UxJJm5ypcto4ly38HFqo4dB6HXRQNVTqin3hTx6UzpjQP/4N2AAAAA="
  },
  {
    "file": "/images/photo-1523906834658-6e24ef2386f9-1fc8664c.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRooAAABXRUJQVlA4IH4AAABQBQCdASoUAB4APt1ao02opSMiN/qoARAbiWgAnTMTBCAfX1e1Z0l07zV0VplWbI/YkWQA8bGPNcz4WAqCiP1q98fk5pl3+Q/y8a7fn0Ks1auHyNm8oP8Kf5yvePFR8/UtjiJCajwKhKWb/PJ/GQOdOYjtmKfsPYpaGCcwAAA="
  },
  {
    "file": "/images/photo-1524396309943-e03f5249f002-c121e4cc.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1524396309943-e03f5249f002?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADwAwCdASoUAA8APu1mq04ppaQiMAgBMB2JZQDE2B6RxNkPVcRbEGrAAP7nk5pzM3jISNfP1KuV0b+hCTaUtDZtMVDRrhko8otbAAAA"
  },
  {
    "file": "/images/photo-1528181304800-259b08848526-127a8380.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAAAQBACdASoUAA0APu1iqU2ppaQiMAgBMB2JagCxGwAB7/cp+2OuQiSTAAD+V15lneNFlpyrla+XVN+0vqwhhgbT3P8zyMjCJMfNrKk9TxZyuImyNj268/v6TsgAAA=="
  },
  {
    "file": "/images/photo-1531366936337-7c912a4589a7-c0909022.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1600&q=85&auto=format&fit=crop",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAADwAwCdASoUAA0APu1iqk2ppaQiMAgBMB2JZACdMoADTt7EwUAplHVAAP7vRBXjqPF2v028rJ6cqy354oMG3dO2/2Y4OAYIcQ7kOcb6SARbYhTZThGtpiAA"
  },
  {
    "file": "/images/photo-1533106497176-45ae19e68ba2-7e7688d5.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAAAQBACdASoUAA0APu1kqk4ppaQiMAgBMB2JZACdMoADTOmnqknlm9KyAAD+4uT7hQNoDiSpv6c5TOQSZH6SDAudkAPT7Bj6mgAAAA=="
  },
  {
    "file": "/images/photo-1534113414509-0eec2bfb493f-58e63edc.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRo4AAABXRUJQVlA4IIIAAACwBQCdASoUAB4APu1qsFCppaSiqAqpMB2JYgCxHyZKQ+Gb/tCt2c10NyjeGXP/B+9JbihmnoAA/vqmxfPvJTqcqtIu60Aqf24DeojBOyYPQ/MSRaH58Yt4vr1REU6IIttRtczK3B1go3BVAkOHDK3yoehqzeF3iRiUh+d6kncZSwAA"
  },
  {
    "file": "/images/photo-1534190760961-74e8c1c5c3da-5ece94bd.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADQAwCdASoUAA0ALrV2u12jqampiYC0SgCsLwAn/4h8a5LwtifSzgAAy0DyFz3hiX0g/edeAPSPIC+7VmAzWH7kfRxDnfJNiieVGmyScAAAAA=="
  },
  {
    "file": "/images/photo-1534430480872-3498386e7856-afb8e582.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAACwAwCdASoUAA0APu1krU2ppaSiMAgBMB2JZwDCgCHWyMrgyQA4AAD+6oE+Y2CPLq+3dsWdTBH+qINy5NzLY7l1pkOAAA=="
  },
  {
    "file": "/images/photo-1537956965359-7573183d1f57-0b2e83eb.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAADwAwCdASoUAA8APu1iqU2ppaQiMAgBMB2JbACdMoACTsmu5fdUBh7AAP6egXW1uavBp4YphwnYg9aGbmuBYIXSFCgdtXiunmVhR6x/phKf7b+URjBZDY1ckYkgAA=="
  },
  {
    "file": "/images/photo-1538485399081-7191377e8241-ff8c71bc.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRpAAAABXRUJQVlA4IIQAAADwBACdASoUAB8APuFip02opiOiMAwBEBwJQBadBDshXhYOvOgRZxdNef1uj7TJ6ggA/uzwCHLBXRKzTxTTwr7c6hDassjwzkNCvAW+us09NJ1IvOsPSdnUAJRsDco8xkluH5zMb5CuWYTT+K8wMGrICb2vAtuL0y4aB8kaTsbEn9JRgAA="
  },
  {
    "file": "/images/photo-1540959733332-eab4deabeeaf-a87af73a.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAAAQBACdASoUAA0APu1iqU2ppaQiMAgBMB2JbACdMoR3ACBEXJx/4E353AD9ZtCtd07c98Z4u6qR0eTfk5cY1tE2OzIxTaeYzLwk/OEgJfvWlu4lSpGDa0xUVwAAAA=="
  },
  {
    "file": "/images/photo-1541370976299-4d24ebbc9077-ba90109e.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1541370976299-4d24ebbc9077?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAAAQBACdASoUAAsAPu1iqk2ppaQiMAgBMB2JaACdMoMxgEnwDv/O0fNsoAD+1Pjv5iqaEJYJ6/XSSjMmv88ZDHqnTj4rqLk3mZZrRulp+AA="
  },
  {
    "file": "/images/photo-1548115184-bc6544d06a58-54daa09c.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADQAwCdASoUAA0APu1iqU2ppaOiMAgBMB2JYwCdACHXZuWC7cTK30AA/uhMLIT7IebusygNBsFVKPc5BC+RksFahUpA5AI5flyGX8AA"
  },
  {
    "file": "/images/photo-1552465011-b4e21bf6e79a-f66eb7d5.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRnYAAABXRUJQVlA4IGoAAABwBACdASoUAA4APu1mqk2ppaQiMAgBMB2JbACdMoR4T4AAYTlKZmkn+ihGwAD+doas2AAb8XG7ZK2IIDSoMb7dFO9tbx70A93zRw9qxAtBUCK5iZNBDeReHD3ExXg1+fyMdcZsjAWt8oAA"
  },
  {
    "file": "/images/photo-1552832230-c0197dd311b5-4538cf4f.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAADwAwCdASoUAA8APu1iqU2ppaOiMAgBMB2JagCsOUAAsr1ah3N8+ChwAPcJHM0MwWJW0LdNmX3dxL5weC+nHob04xgj0csGDEY00LOk8ZT2VTQKJAAAAA=="
  },
  {
    "file": "/images/photo-1559564484-e48b3e040ff4-97555fb1.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1559564484-e48b3e040ff4?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADQAwCdASoUAA0APu1iqk2ppaQiMAgBMB2JZwDCgCFriTuiM0vOXsAA/up8PMKbo7f/l4Y+i3n6II4ZPZgaEQCPlPe1z6SRZmfoHTfnyAA="
  },
  {
    "file": "/images/photo-1563492065599-3520f775eeed-67f3806b.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAABQBACdASoUAA8APu1iqU2ppaQiMAgBMB2JbACdMoMjbDCpPq2VNZlWasBwAP7gUsCGKFGhVJT1VEOWhc5DxJO/To5V4yHWS/PkBSzXqv33xyFVL18CBtoEyDyHUAAA"
  },
  {
    "file": "/images/photo-1565018054866-968e244671af-6baacc4f.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1565018054866-968e244671af?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACwAwCdASoUAAoAPu1iqk2ppaQiMAgBMB2JagCdABVRoHG3nDGUAAD+33A97a7Uu8BMowGRYcMgytfD6dpqC0pYiXmv+zKKLQcAAA=="
  },
  {
    "file": "/images/photo-1568515387631-8b650bbcdb90-c9f1da85.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=2400&q=82&auto=format&fit=crop",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAACwAwCdASoUAA0APu1mq04ppaQiMAgBMB2JZQCdAB6GR4BF7rbMUAD8ZzL7a23HzsllW55l+EPKSTQtDkRjKiCDm0AAAA=="
  },
  {
    "file": "/images/photo-1568515387631-8b650bbcdb90-ff3791ae.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=1200&q=72&auto=format&fit=crop",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAACwAwCdASoUAA0APu1kqk2ppaQiMAgBMB2JZQCdAB6GR5kKPnkaIAD8ZzL7a23HzsQbthlz3JiaF1e0y3zp0WzqXBpVAAAA"
  },
  {
    "file": "/images/photo-1589394815804-964ed0be2eb5-24efd6b0.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAABQBACdASoUAA8APu1iqU2ppaOiMAgBMB2JagCdMoAC+kz0uJRWx1SA3qYAAP7CNYORhn65AKujfXfyHrCdRsUdBT394VnzvxBnLSamstA7rZBZSylJtU7ouYVNONs273Cscl4VoOQB1dcCBAA="
  },
  {
    "file": "/images/photo-1590559899731-a382839e5549-1f98d223.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAADQBACdASoUAB4APu1orU4ppiSiMAgBMB2JQBfnAxvAgNLSG9YbRqb+ykGVk0Np0AD+RhAe8Jp08B+mMx+/a+dvVK31hyWTgnEq/z/spmng0NNnWT2YCv+IlIj1QhUY0dq59La3bu9tVAUv4AAAAA=="
  },
  {
    "file": "/images/photo-1596935884413-260a972dab44-f8b89d82.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1596935884413-260a972dab44?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAAAQBQCdASoUABQAPuVep02pJSOiN/VYASAciWUAwNwPB9LQ3dLJQoVYqZ1z/trQN4SYAP6p0uYwJEiYQdlac1RSowo6mqVhaXGjW+OonrrEAnhqfVIDdvk71EWEJUvat66nV20iVcAAAA=="
  },
  {
    "file": "/images/photo-1598935898639-81586f7d2129-d562b241.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAABwAwCdASoUAA0APu1krU2ppaSiMAgBMB2JZQAAUe9qeTALH4AA/p71aNJms15TUKtOrF3CJgNJgwk9hWkXNDSAnbsI9yAA"
  },
  {
    "file": "/images/photo-1601621915196-2621bfb0cd6e-6eadd74e.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1601621915196-2621bfb0cd6e?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAABwAwCdASoUAA0APu1krU6ppaSiMAgBMB2JYwCw7BN6dVYndcAA/jjxtZugO9J9F2PWU6jFajWYeJ30x7ht7l+o5FESGUACZ8RnxEOoDAAAAA=="
  },
  {
    "file": "/images/photo-1605833556294-ea5c7a74f57d-21e04578.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAAAQBACdASoUAA0APu1iqk2ppaQiMAgBMB2JbACdMoR4GB4KYT56SepXXAD8qSZJccPx+FwzWyeb03t8QE6Xk1hgnegVtoHKmKi+HTw1aTbfG+djrySTO0COEAA="
  },
  {
    "file": "/images/photo-1664888883613-056db50331a7-3c27784c.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1664888883613-056db50331a7?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAAAwBACdASoUAB4APu1iq1AppSOmsBgIATAdiUAWI+0YNFsidzSLiP9eFgAA+6S9H2n4NAXR575C0RbPWsMLxV5UnGbAuL+f2tXEVSSQwSvR91aj5aMYB6tjL0jAAPVFTSp66ro3rB+AAA=="
  },
  {
    "file": "/images/photo-1669682241084-fe2a789ee8ae-bdd2a372.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1669682241084-fe2a789ee8ae?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADQAwCdASoUABAALrV2u12jqampiYC0SyAE6XrkHQsuQR57pqyb6AAA/llDcfNYO0/5GO6r7c48IADeUymA08pUNPD3I+c63QdYESjg3D+gAAAA"
  },
  {
    "file": "/images/photo-1706172216985-a7fdb4efcfc8-b58b1f5c.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1706172216985-a7fdb4efcfc8?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRowAAABXRUJQVlA4IIAAAABwBQCdASoUAB4APu1ur1IppiQiqAgBMB2JYgCdM098qB4Gbf3a65iReHplw/H5nXK04CiAAP1GyNNe437AiN5sUXNnNQSD+LqEt/4ZF8YOhc2el3IyC3Zuffkvf6Ur113aylJ3Ri0iXz5ViUy4XWg4Li4rB11ktdMLLmwnFwAAAA=="
  },
  {
    "file": "/images/photo-1758470476213-6c12dc25930d-4116a5cd.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1758470476213-6c12dc25930d?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAABwBACdASoUABsAPu1mrU+ppSQiMBgIATAdiUAYz4CbVOJJ5cM084WybHOdwAD+v3yv9+mfxIqcT/AjS8EY/YjOJSknZiLJS52UG6LRsoUuyjS78zg4eZQIdWoP4nhffDTcPb2trUDwAA=="
  },
  {
    "file": "/images/photo-1769251847264-0fd19f7d3efd-1b570a60.avif",
    "artist": null,
    "licenseName": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "sourceUrl": "https://images.unsplash.com/photo-1769251847264-0fd19f7d3efd?w=800&q=80",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAADwBACdASoUAB4APtleo02oJaMiN/qoAQAbCWUAxvQiueDwrZ37uXajK8K5vq+vkAAA/s3lVSQoL86TojdteSsyNwcGMP6UrpFjNtQispaaXsABbL4cM9t9du3PaZAA"
  },
  {
    "file": "/images/piran-slovenia-viewpoint-3b375274.avif",
    "artist": "Etienne O. Dallaire",
    "licenseName": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Piran,_Slovenia,_Viewpoint.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAADwAwCdASoUAA0APu1krU6ppaSiMAgBMB2JbACdIExCuFJFlqBAU8m4AMqR0AYbwIn47LonZX9YXt5ncF34i5skgTdVJOGZNGySkXp27hT2nUED3dBV5QAA"
  },
  {
    "file": "/images/plaza-mayor-de-salamanca-panorama-08870ac6.avif",
    "artist": "D.Rovchak",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Plaza_Mayor_de_Salamanca,_Panorama.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAADQAwCdASoUAAkAPu1kqU2ppaQiMAgBMB2JZgCdAB9TOQ+OyaDNEgAA/unUbsVgWOtjtN2pVUGuCQwApgVwenapLnd9WoeKk3OyjEGCuX68Ksq77iKOYo8KGYIAAA=="
  },
  {
    "file": "/images/plze-montage-i-53513400.avif",
    "artist": "Náměstí Republiky - panoramio (6).jpg: Mister No (Panoramio) Plzeň Cathedral of Saint Bartholomew-0146.jpg: Isiwal Rathaus-pilsen.jpg: Matthias Süß Pilseno, la Granda Sinagogo, 30.jpeg: Aisano Plzeň TechMania hala 2.jpg: VitVit Pomnik kopeckeho.jpg: Pablo.czech Nové divadlo v Plzni 03.JPG: Hadonos Plzeň, brána, čelní pohled (2).jpg: Jan Polák Pilsen-Water Tower.jpg: Tamorlan",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Plze%C5%88_Montage_I.png",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRqAAAABXRUJQVlA4IJQAAACQBgCdASoUACEAPuFepE2opSOiNVv4ARAcCWIAnTv/0negMB8CzWQPjn3GsbOHEX+TIjRHCdy4TEc06YMAANRif/bhwPt1bUZWxV3Ktan1rNtsFyAbt7MfyjuU8HS9EYg0AZx/1WwtsgVPsffiD5UJZ4mrp6mABUFeAgnC7UGHnqGYv7gbjiuFEpF0At/fa0wwAAAA"
  },
  {
    "file": "/images/pontikonisi-e7b150e1.avif",
    "artist": "StefanosKozanis",
    "licenseName": "Public domain",
    "licenseUrl": null,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Pontikonisi.jpg",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADQAwCdASoUAA8APu1iqk2ppaQiMAgBMB2JZQC06CHam7iH3QILrCAA/tMbsbeJYQqyFKrJaa13HsopqY7jcmUKP7D6cAAA"
  },
  {
    "file": "/images/porsukbridge-28-332a64c7.avif",
    "artist": "CeeGee",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:PorsukBridge_(28).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAACwAwCdASoUAAsAPu1iqk2ppaQiMAgBMB2JQBOgBHn483VCsxU0AADhgXOCumdycHYTeC9VWnvvuAUlx8HOsRuaYoFN0KuwbrXlvPKfdIX8rgAA"
  },
  {
    "file": "/images/porvoo-in-january-bda546ca.avif",
    "artist": "Olga1969",
    "licenseName": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Porvoo_in_January.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADwAwCdASoUAA0APu1oqk6ppiQiMAgBMB2JZQCdACHaSfDLodBdMh2AAPyPwPe8J/U98xuhwliUFH+O5tESuNY0s0/bhkHlFzeC4eLUChmgAA=="
  },
  {
    "file": "/images/postojna-22206343750-bb7a0497.avif",
    "artist": "Ivan Ivankovic from Dubrovnik, Croatia",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Postojna_(22206343750).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAACwAwCdASoUAAsAPu1iqk2ppaQiMAgBMB2JYgCdABPm4FkdXi4GAAD6McvPV+RqLaVBZ2z9JWPWmONePY/vFdSlFf2ByyRkeFZiuboAAAA="
  },
  {
    "file": "/images/praca-de-giraldo-evora-10250693386-cropped-2166510a.avif",
    "artist": "François Philipp from Darmstadt, Germany",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Pra%C3%A7a_de_Giraldo,_Evora_(10250693386)_(cropped).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAABwAwCdASoUAAsAPu1iqk2ppaQiMAgBMB2JZQAAOtbFN4/BvgAA/udBRP/nSFZWYpGbADhJkhYm/DhS4JAlE8JssAAAAA=="
  },
  {
    "file": "/images/prague-6365119737-cbe51757.avif",
    "artist": "Moyan Brenn from Italy",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Prague_(6365119737).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACQAwCdASoUAAwAPu1iqk2ppaQiMAgBMB2JQBOgBDuPk9lHINkwAP7nrYDQNpn6g5FHKz8j6rsdWO8cPd2r1autBBmwFFpmH0AAAA=="
  },
  {
    "file": "/images/pravcicka-brana-001-b668ec03.avif",
    "artist": "No machine-readable author provided. Olaf1541 assumed (based on copyright claims).",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Pravcicka_brana_001.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACQAwCdASoUAA0APu1kqU2ppaQiMAgBMB2JYgCsAB5sNAtpbVYiAPjcWygvtl/2+tmQyOfR5lEkETyc+Y9VRpKiU9otB39JgAA="
  },
  {
    "file": "/images/puente-don-luis-i-oporto-portugal-2012-05-09-dd--d814b6ab.avif",
    "artist": "Diego Delso",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Puente_Don_Luis_I,_Oporto,_Portugal,_2012-05-09,_DD_13.JPG",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAABQAwCdASoUAAwALrV2u12jqampiYC0SygE6AIc4N40niGrrAD+sjqQTA13om/Vxz0G0GKJ48QnURZOMv7HsjC1+mJ3iaVAAAA="
  },
  {
    "file": "/images/puerto-madero-buenos-aires-40689219792-cropped-7a968964.avif",
    "artist": "Deensel",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Puerto_Madero,_Buenos_Aires_(40689219792)_(cropped).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADQAwCdASoUAAgAPu1qrU8ppiQiMAgBMB2JYwCdACKUV+FPn+4Zs5gA/sXdcM4HmRPZKf/35ww0yS/b8m/V8unYuywLmZ7z1yMSAhO5wJ+16AAA"
  },
  {
    "file": "/images/pyramiden-svalbard-buiobuione-bfe4be42.avif",
    "artist": "Buiobuione",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Pyramiden_Svalbard_buiobuione.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADQAwCdASoUAA0APu1kqk2ppaQiMAgBMB2JQBYdhDYXaNHBmvRm/IAA/rBvsIGMSF6CxDn0KYvFjrHAOaCQFZj/lYWySxu23vM0WAAA"
  },
  {
    "file": "/images/quebec-city-skyline-from-levis-7d77eed6.avif",
    "artist": "Quintin Soloviev",
    "licenseName": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Quebec_City_skyline_from_L%C3%A9vis.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAAAwBACdASoUAAwAPu1mqk2ppaQiMAgBMB2JQBYheDE/wHkA2/XOAgbdhiQA/pFBwb9PaZwBoLok7NL4nqN+6XUZY5RvVOnZTNB/OnfJXAA="
  },
  {
    "file": "/images/quill-creek-kluane-national-park-yukon-canada-f4e9e79b.avif",
    "artist": "Wikibunt",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Quill_Creek,_Kluane_National_Park,_Yukon,_Canada.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAAAwBACdASoUAA8APu1orU6ppiSiMAgBMB2JQBOkHMhZFoPcjtGrYrz020AA/lsw5806xCh+ETXGKEKcRv5U/JIfCjAQ+stNFnJeAFW4AAA="
  },
  {
    "file": "/images/rapenburg-leiden-centrum-0f657551.avif",
    "artist": "Roger Veringmeier",
    "licenseName": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Rapenburg_Leiden_Centrum.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAAAQBACdASoUAA0APu1kq04ppaQiMAgBMB2JYgC7MoACsXf+7XCn7KxfAAD+er4/cjeFNrnPBDvZ4vzFIdHU0J8SajkNRzY9sKa4pZ7QJQDYc+AA"
  },
  {
    "file": "/images/rd-fra-bispegaarden-3ceb1cf6.avif",
    "artist": "Nico/ Nils Jepsen",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:RD_fra_bispegaarden.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAAAQBACdASoUAA8APu1iqk4ppaQiMAgBMB2JaACdMoRwIr+AZewYJLyTEADl+MJa84w5ZOXL2x4HicoFMlNXxDtDl3lgmk3mJc+t7XJ06eFjzEXJD14HBBMAAAA="
  },
  {
    "file": "/images/rhodes-old-town-greece-5-9e136cdc.avif",
    "artist": "Norbert Nagel, Mörfelden-Walldorf, Germany",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Rhodes_old_town_Greece_5.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRn4AAABXRUJQVlA4IHIAAABQBQCdASoUABsAPu1ipk4ppSMiMBgMATAdiWMApxQR51c+N2FuKtP0urB+ArVdhUAOGdgA/tyqhKrcVUJT57WHTlQSnvGfiK7seuYtNJRok0lqqFYRSeupXps8Tc9INWliCb8EqpSb0ztwnKbCg28wAAA="
  },
  {
    "file": "/images/ribevue-4353bed6.avif",
    "artist": "Hjart",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:RibeVue.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADQAwCdASoUAAsAPu1orU2ppqSiMAgBMB2JQBOgA3Ccde9AG2moxBoA/sPw5fY/enHQl2zgpmSjJMz4qvWzVHM5/W1ARXAzdLxDOA1e2yYQAA=="
  },
  {
    "file": "/images/roman-forum-in-zadar-croatia-48607823862-ce42d1de.avif",
    "artist": "dronepicr",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Roman_Forum_in_Zadar,_Croatia_(48607823862).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAACQAwCdASoUAA0APu1kqk4ppaQiMAgBMB2JZgCdMoABCnRP2IsAAPGXZee5GRcP07pMwcyRPfDLbq6X1XFcBHZ4wY6UjLtEm8QfXpBEGzIAAA=="
  },
  {
    "file": "/images/roque-cinchado-und-teide-66b826d3.avif",
    "artist": "Thomas Wolf, www.foto-tw.de",
    "licenseName": "CC BY-SA 3.0 de",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/de/deed.en",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Roque_Cinchado_und_Teide.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAAAQBACdASoUAAwAPu1oqk6ppiQiMAgBMB2JbACdGuAAKQpuk5RTeE8aWAD9RoF6cjgcEgRIriZ9+AMDWhs/MT7QdeLyybhRYOjdkYvLFapY+N9wAAA="
  },
  {
    "file": "/images/rovaniemi-the-lumberjack-s-candle-bridge-8609d6d1.avif",
    "artist": "Tarja Mitrovic",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Rovaniemi_-The_%E2%80%9DLumberjack%27s_Candle_Bridge.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADwAwCdASoUAA0APu1iqU2ppaOiMAgBMB2JZgCdL1AB0TJryxfj/NMAAPHDvS4j0KGNZlFr5L5N1NiXOnnUNu0SGWE4JsI6RhNAAA=="
  },
  {
    "file": "/images/royal-dramatic-theatre-stockholm-8ba5b196.avif",
    "artist": "Steven Lek",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Royal_Dramatic_Theatre_Stockholm.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAACQAwCdASoUAA0APu1iqk2ppaQiMAgBMB2JQBOkBLkgn8ndUy3AAP5T+Hvhat65FYfnsgPhjwp3uWQSk2k+3qg55qowXRfCpTv1M/AAAAA="
  },
  {
    "file": "/images/saint-basil-s-cathedral-and-the-red-square-e4cecb4c.avif",
    "artist": "U.S. Department of State",
    "licenseName": "Public domain",
    "licenseUrl": null,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Saint_Basil%27s_Cathedral_and_the_Red_Square.jpg",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAAAQBACdASoUAAsAPu1iqk2ppaQiMAgBMB2JbACdMoKCAAsvJbIkZo5mAADxhnnWF14SQcrZqtuemA58OyCXejJPwGNw6TY9REre7X2A4MAAAA=="
  },
  {
    "file": "/images/salvador-ba-cropped-2-1f47bb63.avif",
    "artist": "Fotos Gov/Ba",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Salvador_BA_(cropped)_2.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAACwAwCdASoUAAkALrV2u12jqampiYC0SxgFiT/90ACow0Ocq54sgAD+qhet3O7b/bSrV+QBNOGdvHgzbUIaqwkNVFIxAQAA"
  },
  {
    "file": "/images/salzburg-48489551981-17b6dd66.avif",
    "artist": "Jorge Franganillo",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Salzburg_(48489551981).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACwAwCdASoUAA0APu1krU6ppaSiMAgBMB2JZQDE2CHSnTi4xYBWAAD+W+z7hVg2Gm140yEPgr+UHvrohjtHH+Stp1BMRNyxpQAAAA=="
  },
  {
    "file": "/images/san-miguel-de-allende-collage-a23fa780.avif",
    "artist": "Microstar",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:San_Miguel_de_Allende_Collage.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRp4AAABXRUJQVlA4IJIAAABwBACdASoUAB4APtFWoU2oJKMiN+gBABoJQBOmWhhZjMqhjUButUFwcFkVQAD8xkoIe7U2K3RtIibYv0jJgrF872uT1S+00s3VcFWLtkiu2QLeoxdVUi6HpyIzdqCFuNObJ5TWKl9mh+6EQedUK+ciqtbrpE9uvyDEO43bgjDj7ubAd/8XjO9ImxazOS0fQAAAAA=="
  },
  {
    "file": "/images/sarajevo-city-panorama-054399b3.avif",
    "artist": "Julian Nyča",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Sarajevo_City_Panorama.JPG",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADwAwCdASoUAAwAPu1krU6ppaSiMAgBMB2JYwCw7CHenGTXXMvVmPrwAPyOjG2Md8KV2QeXRlr275jHNVks5gq1RXiu9gGqrDAAAA=="
  },
  {
    "file": "/images/schoenbrunn-philharmoniker-2012-e0b7af01.avif",
    "artist": "Superbass",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Schoenbrunn_philharmoniker_2012.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAACwAwCdASoUAAkAPu1kqk2ppaQiMAgBMB2JZQC2yCICVniN+APq4AD6jD8fPqZf3NrbqbaqtG8e4Vlj7AAAAA=="
  },
  {
    "file": "/images/seaward-view-of-visby-town-gotland-sweden-888852-ae166913.avif",
    "artist": "Lars Cedergren",
    "licenseName": "Public domain",
    "licenseUrl": null,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Seaward_view_of_Visby_town,_Gotland,_Sweden_(8888520868).jpg",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAABQBACdASoUABIAPu1qrE8ppiQmsBgIATAdiWUAx+QNwgbs2590gUAfX2CsAP5geeG5G3DRfv8vMGCYxdctD3kwu1attgux0Y3JO/BN4/GaKbc1P9StUAAA"
  },
  {
    "file": "/images/sintra-palacio-da-pena-20332995770-cropped2-656a774d.avif",
    "artist": "Singa Hitam",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Sintra_-_Palacio_da_Pena_(20332995770)_(cropped2).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAACQAwCdASoUAAoAPu1yrU+pp6QiMAgBMB2JYgCdAB89chRIScb+AP6u0Vvl8LNyJ860/YBD3nu4QBZ1Owjye0umhIg8OOWiLDWIJnQA"
  },
  {
    "file": "/images/skagen-rooftops-21caac57.avif",
    "artist": "John Nuttall from Hampshire, United Kingdom",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Skagen_rooftops.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADQAwCdASoUAA0APu1iqk2ppaQiMAgBMB2JZQDE2CHYIXwYn5aIGYAA/uqwansetSb3Ra8w5KpEJPDK2HfMfskc0EShVNEAAAA="
  },
  {
    "file": "/images/skanderbeg-square-tirana-2016-81a754dd.avif",
    "artist": "Photo: Chris Walts",
    "licenseName": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Skanderbeg_square_tirana_2016.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAACwAwCdASoUAAoAPu1iqU2ppaOiMAgBMB2JZgCsACHceuDm4vVbAAD971sEKjjpOPQZsWwc3ZCpbaid9W4tiMY0Z+BybuAA"
  },
  {
    "file": "/images/skyline-of-beijing-cbd-with-b-5906-approaching-2-20bc9cef.avif",
    "artist": "N509FZ",
    "licenseName": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Skyline_of_Beijing_CBD_with_B-5906_approaching_(20211016171955)_(1).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACQAwCdASoUAA0APu1mqk4ppaOiMAgBMB2JQBOgA8nR5deiFXCSAPcfdavTky0ix5P5Kap8WX7nic3O2DyztqPN/9tRZanAAAA="
  },
  {
    "file": "/images/skyline-of-edinburgh-cd54c8b4.avif",
    "artist": "Andrew Colin",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Skyline_of_Edinburgh.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAACwAwCdASoUAAsAPu1kq04ppaQiMAgBMB2JQBOgA2WArqVb1z2OiAD8gXCQdca/t+bDfo3NOM/c8GlFqOP2Hfm04UmAudyk/MGGa4c0aREcPoAA"
  },
  {
    "file": "/images/skyline-of-vancouver-canada-d6cb4412.avif",
    "artist": "Quintin Soloviev",
    "licenseName": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Skyline_of_Vancouver,_Canada.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADQAwCdASoUAAwAPu1iqU2ppaQiMAgBMB2JQBOgBD/RQGgZtbOUB8AA/G5TIe9N+QTRDhiaCPZZcq5/MsKsRtp4bGnj/yCyIAA="
  },
  {
    "file": "/images/skylinefoz-9b2a562e.avif",
    "artist": "SamirNosteb",
    "licenseName": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:SkylineFoz.JPG",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADQAwCdASoUAA0APu1kqk2ppaQiMAgBMB2JYwC7ACHEN7LgIq8qutIA/u1I91do/t5pmooUjZQ/quSZdRNdmo9eLuSAAA=="
  },
  {
    "file": "/images/sobrevuelos-cdmx-hj2a4913-25514321687-cropped-8cd35c8f.avif",
    "artist": "Gobierno CDMX",
    "licenseName": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Sobrevuelos_CDMX_HJ2A4913_(25514321687)_(cropped).jpg",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADQAwCdASoUAAoAPu1yrU+pp6QiMAgBMB2JYwCdACID+vBKplVl1qAA8lLiFgIA7MinMZIu5XATD3K1f8dYgAy1THAAAA=="
  },
  {
    "file": "/images/soca-4-63ed805d.avif",
    "artist": "Florian Jesse",
    "licenseName": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Soca_4.jpg",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAACQAwCdASoUAA8APu1kq04ppaQiMAgBMB2JQBdgA8vcCvchxtoAAP6tk4G7qN9de2Jn1t+TTVGNBGJV+zt2k904TPT8YWwR63jz3Y4pLQAAAA=="
  },
  {
    "file": "/images/sochi-harbour-684559b0.avif",
    "artist": "Trace",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Sochi_harbour.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADQAwCdASoUAA8APu1iqU2ppaOiMAgBMB2JZACdMoADTDvmdWWCooAA+mrsWcnkiKuEuzbHWhOJ/YFfriyx7tlLVRFM0gxpCyvDZLzEAAA="
  },
  {
    "file": "/images/spb-06-2017-img20-stmichael-castle-cropped-8760280d.avif",
    "artist": "A.Savin",
    "licenseName": "FAL",
    "licenseUrl": "http://artlibre.org/licence/lal/en",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Spb_06-2017_img20_StMichael_Castle_(cropped).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAACwAwCdASoUAAoAPu1qrU8ppiQiMAgBMB2JYwCdABXpJqmovDNSAAD3A/Pt6CnhCzV8bhURp9iRbwf88LAAiuKkNyr8YcAA"
  },
  {
    "file": "/images/split-080620-133710-img-0968x-c6360aaa.avif",
    "artist": "Tatyana Peshkova",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Split_080620-133710-IMG_0968x.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADwAwCdASoUAA0APu1kqk2ppaQiMAgBMB2JQBOgBEBKEmWLNMSECuFAAP5bLel1jRuhy8JNI4rbIFEuN0u6HJozjlaRmuYFGOddEHagADti3A0ZqAA="
  },
  {
    "file": "/images/stadtbild-munchen-62226b63.avif",
    "artist": "Thomas Wolf, www.foto-tw.de",
    "licenseName": "CC BY-SA 3.0 de",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/de/deed.en",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Stadtbild_M%C3%BCnchen.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAACwAwCdASoUAA4APu1kqU2ppaQiMAgBMB2JYgCdMoADYhjw9wzfEAD9zjLUXmmYBmQak8RsV+PVw/ctdcBHIWzShJeU8lXVsur5WAAA"
  },
  {
    "file": "/images/stare-miasto-ratusz-staromiejski-w-toruniu-e196a03a.avif",
    "artist": "Domun",
    "licenseName": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Stare_Miasto,_Ratusz_Staromiejski_w_Toruniu.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADwAwCdASoUAA4APu1krU6ppaSiMAgBMB2JQBOgA+s4HuiBVz2q0FYAAP6aR3EpERcG5sHBOrbZJ/SdvafDva42NuniApjNWJHnIHPyGk8pi1AgAAA="
  },
  {
    "file": "/images/stari-most-viewed-from-north-dbac591a.avif",
    "artist": "Bernard Gagnon",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Stari_Most_viewed_from_North.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAACwAwCdASoUAAcAPu1kqU4ppaOiMAgBMB2JYwDCgCGImTdPkFhOAADN21o+/CeVo+g2GnVa2u3mE4bNjSGFWwsz+KAAAA=="
  },
  {
    "file": "/images/stary-rynek-w-poznaniu-widok-z-drona-cropped-4c6fc699.avif",
    "artist": "Aneta Pawska",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Stary_Rynek_w_Poznaniu,_widok_z_drona_(cropped).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACQAwCdASoUAAsAPu1kqU2ppaOiMAgBMB2JQBOmUABmfhLhf0FMAMmshN1sIVq/Mm+CmJusX/rmuYe0DYap5tnpJAFyHrP0AAA="
  },
  {
    "file": "/images/storno-haz-t-ztorony-es-varoshaza-db5e519e.avif",
    "artist": "Thaler",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Storno-h%C3%A1z_T%C5%B1ztorony_%C3%A9s_V%C3%A1rosh%C3%A1za.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAAAwBACdASoUAA0APu1kqk2ppaQiMAgBMB2JQBOmUI+PBTh0HcyCwfvaSQAA/m6efBuNUOGDNkiGf0u6VFQH/+oy5d+wbzQxVMKYmchJGjGrB9u4AAA="
  },
  {
    "file": "/images/sumela-from-across-valley-4b872ab7.avif",
    "artist": "Bjørn Christian Tørrissen",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Sumela_From_Across_Valley.JPG",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAACQAwCdASoUAAgAPu1mq04ppaQiMAgBMB2JZQC06BIxs7+ss3iwAP6ik8zlmQ4Xu2fEKKA6szaDyAaUrdY3l8VvX6MAAA=="
  },
  {
    "file": "/images/sunset-over-bodrum-i-4519dfa1.avif",
    "artist": "The 3B's",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Sunset_over_Bodrum_I.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAAAQBACdASoUAA0APu1kqU2ppaQiMAgBMB2JYwCdIKnDBM+lVtedIx2oAADN4GNm1IsRO2A3Qve44dxL/q2D8oG2rEwVw5TCZUWmVz4wAAA="
  },
  {
    "file": "/images/suomenlinna-cropped-c0aebe2c.avif",
    "artist": "Michal Pise, Michal.Pise",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Suomenlinna_(cropped).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACQAwCdASoUAAsAPu1mqk2ppaQiMAgBMB2JZQCdACHB0pvbBsk8APfazod5gCuMJdDIC5WndOvCdzQvbHB1jx1wbDYKBGP1GycAAA=="
  },
  {
    "file": "/images/szentendre-montage1-402fe139.avif",
    "artist": "SNRTZ Minden kép saját",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Szentendre_montage1.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRqAAAABXRUJQVlA4IJQAAAAwBQCdASoUABsAPu1qqFCppiOiqA1RMB2JYgCnFA3azy+1F5zQGK4fx9yKbZyDLLZZAADch8WRoBJQ/Wwy+rgPgm2dQJinYG5IrbBwyxFgY9UOSsGMd00xIO1Hm6LVYzH76yjpt5DZ0lhZgxCl1ezOISSoYhcGoB4WBc71SkoIyGkhqfA4f8apOhwaJxz5JGloIAAA"
  },
  {
    "file": "/images/tafelrond-leuven-385956-onroerenderfgoed-141b0022.avif",
    "artist": "Vandevorst, Kris",
    "licenseName": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Tafelrond_Leuven_-_385956_-_onroerenderfgoed.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADwAwCdASoUABAAPu1krU6ppaSiMAgBMB2JYwC/ZwAB05XuXYchkdBIAP7gMjjwLVC7fgwLALGK4/kexC2333AwuTG4tu8wXQY0AAAA"
  },
  {
    "file": "/images/tampere-panorama-2021-81a8ff45.avif",
    "artist": "Tiia Monto",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Tampere_panorama_2021.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADQAwCdASoUAAcAPu1kq04ppaQiMAgBMB2JYgCdMoACK44OsUeJeQAA9591w1XfqRwb9bSeEVZcoBC+UDlw/Wnnb+vESD5OPDZprRiAAAA="
  },
  {
    "file": "/images/tekija-blagaj-vrelo-bune-7ef1278e.avif",
    "artist": "Yakamooda",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Tekija_Blagaj_-_Vrelo_Bune.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAABwAwCdASoUAAsAPu1iqk2ppaQiMAgBMB2JZgDCgAq/lFu3PkgA/YFWNAvF/vhoMp9lnTs9SZ7AfqExPh+2Rnj8j1thFOFvIAQNzxJRIAA="
  },
  {
    "file": "/images/tessaloniki-bw-2017-10-05-18-22-47-a61113ec.avif",
    "artist": "Berthold Werner",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Tessaloniki_BW_2017-10-05_18-22-47.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADQAwCdASoUAAwAPu1mqk4ppaOiMAgBMB2JQBOgBEBGAhZftFYMIQAA/sO3CSY2AsU2IXgf+b3OxTl8r1XvIMi/ppf43PjukcAl7aDYQAA="
  },
  {
    "file": "/images/texel-island-a26e28f7.avif",
    "artist": "Cycletours Holidays",
    "licenseName": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Texel_island.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAACQBACdASoUABQAPu1urlIppiQiqAgBMB2JQBBXwItu2u1lPatHXc4MorzWL0gA3hGI+D0WqjfTdKlNSP6zpSwj6a/4HVq+2ZOHTIwUbqNOmee2pjaSzNTcTwAAAA=="
  },
  {
    "file": "/images/thamrin-dari-hotel-take-s-cropped-594e4a12.avif",
    "artist": "Ya, saya inBaliTimur",
    "licenseName": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Thamrin_dari_Hotel_Take%27s_(cropped).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAAAQBACdASoUAA4APu1orU6ppiSiMAgBMB2JbACdMoR4GCko6FMLeKGDwADJsPzPFNrqxTzvA2cvX1A4eLmNzR9v+kgYUuasjCJQvSkivCSFgiIDaXpWFvzWiQAAAA=="
  },
  {
    "file": "/images/the-city-and-the-prokletije-from-the-castle-c7dda491.avif",
    "artist": "Ivan Koev",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:The_City_and_the_Prokletije_from_the_castle.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAABQBACdASoUAAsAPu1kqk2ppaQiMAgBMB2JYgCdL1AB1AkRQ8AQv++oFFmAAPyMmisaSjoJeHtmUk+opzebFmf7dQBtilouBhCA42shk4wIooAA"
  },
  {
    "file": "/images/the-great-wall-of-china-at-jinshanling-edit-3ee387fe.avif",
    "artist": "Severin.stalder",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:The_Great_Wall_of_China_at_Jinshanling-edit.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADQAwCdASoUAA0APu1kqk2ppaQiMAgBMB2JYwCdMoADTfaukk5K2jwA99FHJcr3iOOX0TzaYvvnXUb1DuyNjUvWpPctY6zK3EcAAA=="
  },
  {
    "file": "/images/the-walls-of-the-fortress-and-view-of-the-old-ci-779d96bd.avif",
    "artist": "Zysko serhii",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:The_walls_of_the_fortress_and_View_of_the_old_city._panorama.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADwAwCdASoUAAwAPu1iqk2ppaQiMAgBMB2JZgCdMoADQxGlaeZ5mNzAAP7i9mXlibsrAumClVVLo/xjwyyIvvP0a1rfC1ZZGoUrQLQjOnTNAAAA"
  },
  {
    "file": "/images/theth-church-albania-50b65d51.avif",
    "artist": "peter_h",
    "licenseName": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Theth_Church_Albania.jpg",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAADQAwCdASoUAA8APu1kq04ppaQiMAgBMB2JZACdACHV2xWCcWgaugAA/tQuvW0mZ2IbNnolR5YKAGSEwr8wEasRI+pJrqdIrgyMIhQ9lviLtTbL9e/v980AAAA="
  },
  {
    "file": "/images/toronto-skyline-from-olympic-island-june-20-2026-3ac92801.avif",
    "artist": "Dillan Payne",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Toronto_Skyline_from_Olympic_Island,_June_20_2026_(5-3_cropped).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAACQAwCdASoUAAwAPu1iqk2ppaQiMAgBMB2JYgCdACHZf5n1oStwAN1Ecc4UQMzX3x3c/eQRVL/EKGFccKH9YNp6jAAAAA=="
  },
  {
    "file": "/images/town-of-banff-viewed-from-sulphur-mountain-99082f79.avif",
    "artist": "Ethan Sahagun",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Town_of_Banff_viewed_from_Sulphur_Mountain.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADQAwCdASoUAA0APu1iqU2ppaOiMAgBMB2JYwCsAA7BYNoMm1Z/3QAA8clWXn5qWC/lbPbaSTHMpfpoeG5zDF1Mbr9irrx7RBQAAA=="
  },
  {
    "file": "/images/travnik-collage-image-7dbd7443.avif",
    "artist": "Multiple users. See History",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Travnik_(collage_image).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAABwBACdASoUABgAPuVkpE2pJiOiMAwBIByJQBZZg1nEqWlBXbHmA7trh81kAACwZyS8eP5HusT3tXXt5t3SCFhOrPM7+jxGgDp7fGpXaApqGQqH6RS2V0vJRdOPfs06dAXF/7YWV6SE3vi9YeAAAA=="
  },
  {
    "file": "/images/trebinje-altstadt-28776847.avif",
    "artist": "Alekscg",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Trebinje_Altstadt.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAADwAwCdASoUAA8APu1iqU2ppaOiMAgBMB2JagCdMoLT9AY76dTX8JDoAOC2LoLaoPmvnaFrOsL6ZiamKtO8rVwtFxINZJFTDzHMTxLUFDwsdVMRgvKo/YCDpghP1xXCrzTHEp0PR6AAAA=="
  },
  {
    "file": "/images/troms-sentrum-5835702754-e77f1a5f.avif",
    "artist": "The Municipality of Tromsø from Tromsø, Norway",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Troms%C3%B8_sentrum_(5835702754).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAAAQBACdASoUAA0APu1iqU2ppaQiMAgBMB2JYwCdMoADVTOnaKFmln9o4AD8qPvNYRXs+KJRcAQ4iR9v6mnJLyepwxropqp1t7P0AA=="
  },
  {
    "file": "/images/trondheim-overview-01-4b2c14dc.avif",
    "artist": "Trondheim Havn from Trondheim, Norway",
    "licenseName": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Trondheim_overview_01.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAACQAwCdASoUAA0APu1iqU2ppaOiMAgBMB2JYgCdACHmTQyW9FXAAPfRDe8phtgofCGqW2SZbDjfAy5EeqyZmOGfPDcdTQiVlD5wuWAA"
  },
  {
    "file": "/images/tulum-2-a01a5fb1.avif",
    "artist": "Popo le Chien",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Tulum_2.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAACwAwCdASoUAAsAPu1oqk6ppiQiMAgBMB2JagCdACBvXjazF1s/oAD98/p3ueJLi1y4Qg18+6jW96nSWoYLg1h6/blGxJyZTFa6C0GMj8AAAA=="
  },
  {
    "file": "/images/typhical-landscape-of-stockholm-archipelago-fjar-3c64eb88.avif",
    "artist": "Tommie Hansen",
    "licenseName": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Typhical_landscape_of_Stockholm_archipelago,_Fj%C3%A4rdl%C3%A5ng,_Stockholm_(Sweden)_-_panoramio.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAADQAwCdASoUAA0APu1kqU4ppaOiMAgBMB2JagCdLoAAIYt25DVVoSAA3XJJ1297wJB4Y6kxszIjHrPg8qd9S2qVzjAdiC6CcKTQsXg1KDjXC/2lsUUjgmFF8/+wuf5Peq+OVJXAAAA="
  },
  {
    "file": "/images/ubud-49818456887-39dbe4d6.avif",
    "artist": "Jorge Franganillo",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Ubud_(49818456887).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAACwAwCdASoUAA0APu1iqU2ppaQiMAgBMB2JZQCdAB8gJLA6n1SvwAD5/+0LhOZOodC5NdceCxAzfAAIEDVIFMfFJuuI2RBaLXClInb1AAA="
  },
  {
    "file": "/images/ulcinj-montenegro-sept-2010-c237535c.avif",
    "artist": "Andrey from Russia",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Ulcinj,_Montenegro_-_Sept._2010.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADQAwCdASoUAA0APu1orU6ppiSiMAgBMB2JYwCdACHWF35+cnwxJ8AA/u/B2aOyS2j3WP6Mj849V/L/kR4XbQBwUcJKoClhRW+CcFQoAAA="
  },
  {
    "file": "/images/uluwatu-panoramio-99c998bf.avif",
    "artist": "kharistama",
    "licenseName": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Uluwatu_-_panoramio.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAAAQBACdASoUAA0APu1krU2ppaSiMAgBMB2JYgCdMoADTMdgAmGxprcDgAD+xc+R8imDoMPPizbpNinCgydIWsowZkjCsQDlnpTE26DZMQNsh4SfbmADAAAA"
  },
  {
    "file": "/images/universitat-debrecen-nr-3-8c907939.avif",
    "artist": "Björn Láczay",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Universit%C3%A4t_Debrecen_Nr._3.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAAAwBACdASoUAA8APu1iqk2ppaQiMAgBMB2JZgCdMoMxgEmLgspp46DnLIAA/lDG4aGigNdl0L7LToUSL2MmL8jNpdWOLSGkpxT+YEQjLbgHRKLGD4AAAA=="
  },
  {
    "file": "/images/uppsala-2684e6bf.avif",
    "artist": "Axebackman",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Uppsala.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRsIAAABXRUJQVlA4ILYAAADwBQCdASoUACQAPu1oqU2ppiQiMAgBMB2JZACxH+2F9fxgJzjKG4LYARhqzuQNpnp9Ei14LGWyAAD51oWL90JOPScGoeTqQv+iYjtDihMLYzFEztBlaYYyMgE0kvIjNg8EH6i0mt7h44Ls5smTpxhMuOL/HpP5isYGxHQNa4H06gyM8111XfzrDn89CnB/i0jJdYAo8sRF6J81RQ5mLPknCZBA8YQWHbrz8xElLs5unaonOQAAAA=="
  },
  {
    "file": "/images/ushuaia-aerial-panorama-ad610a3e.avif",
    "artist": "Deensel",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Ushuaia_aerial_panorama.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAABwAwCdASoUAAsAPu1Ct1apoqakGAEwHYlAE6AMoZbN3IV4aFAA/uo5t0Y9wxuwMgjI9aJ4tW+iBsDKKvaajrQNUCsNuiEF3yAAAA=="
  },
  {
    "file": "/images/usumacintayaxchilan16-8b2bbd2a.avif",
    "artist": "Thelmadatter",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:UsumacintaYaxchilan16.JPG",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADQAwCdASoUAA0APu1iqU2ppaOiMAgBMB2JZQCdACHXSwr105B2C3AA/tb9g3Bo9ct0RfRDsZ18sbn7699FVukozwJ9bOtNgf+AAA=="
  },
  {
    "file": "/images/utrecht-16295236803-4e782ecf.avif",
    "artist": "Sebastiaan ter Burg from Utrecht, The Netherlands",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Utrecht_(16295236803).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAACwAwCdASoUAA0APu1krU2ppaSiMAgBMB2JZwCdACHXelNbAYWrAAD+00xuLCOqyNS5JJSyOQZ21c1klf3QG8AA"
  },
  {
    "file": "/images/view-from-gellert-hill-to-the-danube-hungary-bud-a4686a09.avif",
    "artist": "Visions of Domino",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:View_from_Gell%C3%A9rt_Hill_to_the_Danube,_Hungary_-_Budapest_(28493220635).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAABwAwCdASoUAAoAPu1kqk4ppaQiMAgBMB2JQBOgAa+9LgjRNHAA/TI/p9az/wAH+2My7SAjuLVzhqSokjuVFzpIk4oSRxJhzpegAA=="
  },
  {
    "file": "/images/view-from-turku-cathedral-tower-fa395d50.avif",
    "artist": "Markus Koljonen (Dilaudid) with thanks to Jontts and Turku Cathedral",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:View_from_Turku_Cathedral_tower.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAAAwBACdASoUAAcAPu1mqk2ppaQiMAgBMB2JYwDCgCKUXVp5NEgiyyUr2MAA4gOZoT0zxhBDMenHUgC1P/mAQoAA"
  },
  {
    "file": "/images/view-in-plitvice-lakes-national-park-70cda822.avif",
    "artist": "Zysko serhii",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:View_in_Plitvice_Lakes_National_Park.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRooAAABXRUJQVlA4IH4AAADQBACdASoUABwAPu1krVAppSQisBgIATAdiUAU4oCz2/1xYIkH15ZuszgBBiVT4ADOJIKqzYqWKENPYxqDuCqO/o2J48s72E+sElVmU4x+FnDmqfdpQst0Elz7gB1QpWNtH8EmuBnmabE40lJR51vH5/D96w4Wf14EwrfgAAA="
  },
  {
    "file": "/images/view-kas-779e103b.avif",
    "artist": "Luc Coekaerts",
    "licenseName": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:View_Kas.jpg",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAADQAwCdASoUAA8APu1orU2ppqSiMAgBMB2JQBOj+ABOnGYZDTZ/reAAyw5H5e35OnWcCZu/5+29mEXZpeyeswv1ftdVYf6Z3zPoAvNOcrdmBsx49AAAAA=="
  },
  {
    "file": "/images/view-of-hvar-02-4e47b080.avif",
    "artist": "Bernard Gagnon",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:View_of_Hvar_02.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAACwAwCdASoUAA0APu1oqk6ppiQiMAgBMB2JQBOmUABpeqzA3Ik0AADOPbI1xLuR+FDViUmEym200Cus7JLflsHtG3q4ycR5YdB4P7NHThAAAA=="
  },
  {
    "file": "/images/view-of-subotica-2024-f9fc363a.avif",
    "artist": "This image was made by Sadko. Please credit this with: \"Sadko, Wikipedia\" in the immediate vicinity of the image. A message to me would be appreciated as well. If you wish to use, license, or buy the image, please contact me to discuss terms. More of my work can be found in my personal gallery.",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:View_of_Subotica_(2024).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADQAwCdASoUAA8APu1oqk6ppiQiMAgBMB2JQBdgBDzQl2SMd0BO8oAA/duMLEU7sInsleFiq04iOsfqj66bC7lm7jn++3jOorEXiEGewAAAAA=="
  },
  {
    "file": "/images/vista-de-alicante-espa-a-2014-07-04-dd-67-70-pan-2abb204e.avif",
    "artist": "Diego Delso",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Vista_de_Alicante,_Espa%C3%B1a,_2014-07-04,_DD_67-70_PAN.JPG",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADwAwCdASoUAAYAPu1krU2ppaSiMAgBMB2JQBOmUABqSWVxiQSFZeSEAPylE6EQnTbKtOrOyeQcBASfybExzwYo9A2gzc0j4JHd+QAA"
  },
  {
    "file": "/images/vladivostok-gum-department-store-p8070703-2200-59d2bab3.avif",
    "artist": "Alexxx1979",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Vladivostok._GUM_Department_Store_P8070703_2200.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACwAwCdASoUAA0APu1mq04ppaQiMAgBMB2JZQC+SB6WM8T3N3UFAAD+50Cpj/F7ykLOPsXozPoqp/Z43QINz74PFkzRdzr0kWgAAA=="
  },
  {
    "file": "/images/wachau-2-823485e8.avif",
    "artist": "C.Stadler/Bwag",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Wachau_(2).JPG",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADQAwCdASoUAAsAPu1kqU2ppaQiMAgBMB2JQBOmUABpqIJfq/ubbMgA/rIw/z863K32gHLIy9qT+Uw9VWxQ51Gd0I6SxQYgEmMx+ycAAAA="
  },
  {
    "file": "/images/waterfall-on-una-river-in-martin-brod-4fa8fcf3.avif",
    "artist": "Hasan Zulic",
    "licenseName": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Waterfall_on_Una_river_in_Martin_Brod.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRnwAAABXRUJQVlA4IHAAAABQBACdASoUAA8APu1kqk4ppaQiMAgBMB2JYgCdMoADQxY3Dl0qT28RZMTgAP7sKxGUVH2ql7njd8x501hEi3f+oWnKDLLxqhiT2jQSS7RJPuV+H/xol3Rjj3GxYxo+Tr9SK4Dn4VoDZPg7LxkcsZAA"
  },
  {
    "file": "/images/wayag-island-raja-ampat-14487430093-a7c45468.avif",
    "artist": "Elias Levy",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Wayag_Island,_Raja_Ampat_(14487430093).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRoAAAABXRUJQVlA4IHQAAADQBACdASoUAB4APu1qrFEppaQiqAqpMB2JQBmaBp3FFPZI09sjX86mE4XB/zaRAAD+83l+C7t6NTDvJBH0MQaejXlOJSVBb0iJ9gsy/bPZzN4Hs5/XnnaYfLhjt+n6d2HY9YHoxqF62QHy7TFrYHCib1gAAA=="
  },
  {
    "file": "/images/windmills-in-mykonos-02-6cfd199e.avif",
    "artist": "Bernard Gagnon",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Windmills_in_Mykonos_02.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADQAwCdASoUAA0APu1kqk2ppaQiMAgBMB2JQBie+AA/HCj+pyMd9SQA/ZehN6Rj24hyM4KkYGvohvZDoHyzxdJjzNwk54T4yja+8HfBWrAAAA=="
  },
  {
    "file": "/images/wroclaw-most-grunwaldzki-97098d65.avif",
    "artist": "Jar.ciurus",
    "licenseName": "CC BY-SA 3.0 pl",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/pl/deed.en",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Wroclaw-_Most_Grunwaldzki.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADwAwCdASoUAAwAPu1iqU2ppaQiMAgBMB2JYwC7ACFwiKsnuyRzYAAAAP5YBFns1D+4cJAq6qmgm+CS1/J0kHzyIBdttiEY4jXdPMkfCwAAAA=="
  },
  {
    "file": "/images/wybrze-e-bornholmu-f8ec707e.avif",
    "artist": "Lilly M real name Małgorzata Miłaszewska",
    "licenseName": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Wybrze%C5%BCe_Bornholmu.JPG",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAADQAwCdASoUAA0APu1kqk4ppaQiMAgBMB2JYwCsMoAC+tHxpPMKuVgA/ahsySAVihtlc3WekRiIp09RuX4ys3A+KSGHhLK6HlQiKgUmsWBFBjKv1HEAAA=="
  },
  {
    "file": "/images/xiangshan-scenic-area-89468-guilin-31130832628-06a29f0c.avif",
    "artist": "xiquinhosilva",
    "licenseName": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Xiangshan_Scenic_Area_89468-Guilin_(31130832628).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAACQAwCdASoUAA0APu1iqk2ppaQiMAgBMB2JYwCw7BcmmDb34i+UAPzBhRKjwNn5onjNmSMhvNGxNGMqGwrFgxjgIcxaAAAA"
  },
  {
    "file": "/images/york-minster-2797690-44abeb71.avif",
    "artist": "FEGreene",
    "licenseName": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:York_Minster_(2797690).jpg",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAAAQBACdASoUAA8APu1kqk4ppaQiMAgBMB2JQBdgAvfCiqEblyy59KF8AAD+84LQhFVELhDjeDmCfohVnGE2ogunTooNXrwmkGcWbkqidhFg/uIW9wAAAA=="
  },
  {
    "file": "/images/zaanstad-zaanse-schans-22-7d9ab428.avif",
    "artist": "Zairon",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Zaanstad_Zaanse_Schans_22.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACQAwCdASoUAAoALrV2u12jqampiYC0SxAE6AIgIYRilx7hHW+AAP6LVLA5GC/7cwmHAlOUNHq5L9WQ4plC7omxgTvFElU8ILgAAA=="
  },
  {
    "file": "/images/zagreb-29255640143-297b40ff.avif",
    "artist": "Nick Savchenko from Kiev, Ukraine",
    "licenseName": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Zagreb_(29255640143).jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACwAwCdASoUAA0APu1oqk6ppiQiMAgBMB2JYwCw7CHJnWXgHx3BAAD92C6aSPFK5LfInssz3PR62hDZyDr3AFLUmr7QVQSOMdpAAA=="
  },
  {
    "file": "/images/zakopane-t58-0546386c.avif",
    "artist": "Jerzy Opioła",
    "licenseName": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Zakopane_T58.jpg",
    "attributionRequired": true,
    "lqip": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAACwAwCdASoUAA8APu1kq04ppaQiMAgBMB2JQBOgBDsysNU8TRblAAD+30hvr96zJ5uvWVmCXpNLdlnpIufpOtc+1ocyikUWq7h3rAAA"
  },
  {
    "file": "/images/zell-am-see-wiki-a5b8b861.avif",
    "artist": "Bestzeller",
    "licenseName": "Public domain",
    "licenseUrl": null,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Zell_am_See.Wiki.jpeg",
    "attributionRequired": false,
    "lqip": "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAADwAwCdASoUAA0APu1qrU8ppiQiMAgBMB2JagCdAB5Ok+s33ZZklvpAAN1xhy9VFvicV7SV1bUe3B/q1oZSHeO1rUnri5QxUxTCyKV2lpT+AdOtvexBSp4AAAA="
  }
];

const byFile = new Map(IMAGE_CREDITS.map((c) => [c.file, c]));

export const creditFor = (file: string): ImageCredit | null => byFile.get(file) ?? null;
