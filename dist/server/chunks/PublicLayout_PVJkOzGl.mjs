import { f as createComponent, m as maybeRenderHead, h as addAttribute, r as renderTemplate, i as createAstro, j as renderComponent, l as renderSlot } from './astro/server_DrPyCXaf.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout, a as $$AnnouncementBar } from './AnnouncementBar_D7JCKYgK.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { u as useCartStore, s as sonnerResponse, L as Loader } from './Loader_Dg35OGdW.mjs';
import { f as formatCurrency, a as axiosInstance, b as API_ENDPOINTS, u as useAuthStore, s as secureStorage, A as AppProviders } from './AppProviders_CurmEGpy.mjs';
import { useCallback, useState, useRef, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useMutation, useQuery } from '@tanstack/react-query';
import 'clsx';
import { l as logoSvg } from './logo_au4Mtp7B.mjs';
import { toast } from 'sonner';

function LogoIconSvg({ className, width = "100%", height = "auto", color = "white" }) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      width,
      height,
      viewBox: "0 0 2311 362",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      className,
      children: /* @__PURE__ */ jsxs("g", { style: { mixBlendMode: "hard-light" }, children: [
        /* @__PURE__ */ jsx("path", { d: "M806.722 56.0081C803.233 53.0117 797.807 49.9492 796.244 47.4198C796.705 46.1354 796.69 45.2686 797.975 44.6661C806.404 40.7136 905.976 42.5794 921.977 44.3036C937.177 45.9417 952.029 48.492 966.396 53.8455C1001.54 66.9421 1029.86 90.4345 1045.63 124.963C1063.19 163.408 1062.42 207.799 1047.81 247.05C1036.27 278.084 1011.02 307.686 980.584 321.285C979.93 321.577 979.252 321.792 978.562 321.975C971.954 321.327 953.746 327.177 946.42 329.621C926.28 336.344 912.375 334.224 891.543 334.348L800.568 334.287C806.041 329.715 812.816 321.349 813.883 314.205C816.794 294.702 816.639 275.359 816.669 255.797L816.718 186.894C816.721 161.618 819.986 71.2187 809.634 56.2856L806.722 56.0081ZM852.129 319.446C861.81 328.904 868.665 329.146 881.759 329.331C923.874 329.923 952.429 328.963 986.673 301.617C991.716 295.291 997.607 288.068 1001.62 281.142C1018.78 251.486 1020.43 208.888 1016.92 175.642C1013.21 140.581 995.571 102.771 967.32 80.787C931.193 52.6752 896.87 50.7774 853.715 51.3409L850.109 52.3135C847.62 63.4142 849.736 113.563 849.752 127.778L849.772 241.432C849.758 259.951 849.172 281.282 849.767 299.571C849.922 306.256 850.713 312.912 852.129 319.446Z", fill: color }),
        /* @__PURE__ */ jsx("path", { d: "M935.142 163.034C935.222 161.053 935.41 150.534 936.145 149.618C937.549 191.205 949.755 186.962 984.579 194.036C969 196.355 952.725 195.765 942.62 209.31C935.114 219.372 936.543 230.229 935.994 242.645L935.293 229.329C935.433 227.739 935.748 226.315 934.808 225.027C933.881 228.185 933.024 231.031 932.374 234.278C932.094 231.857 932.023 228.274 930.468 226.609L929.468 233.873C929.234 231.47 928.931 229.074 928.556 226.689C924.942 204.525 912.523 197.219 891.882 195.654C889.225 195.453 887.202 195.617 885.072 194.076C897.038 188.069 900.748 197.772 921.323 179.737C928.885 173.11 928.489 162.59 929.093 153.377L929.802 153.227C930.062 155.716 930.036 158.222 930.062 160.726L931.288 159.615L934.148 164.768L935.011 164.58L935.142 163.034Z", fill: color }),
        /* @__PURE__ */ jsx("path", { d: "M932.373 234.278C933.023 231.031 933.881 228.185 934.807 225.027C935.747 226.315 935.433 227.739 935.293 229.329C934.521 235.385 934.224 238.42 934.391 244.501L932.191 245.333C931.834 241.581 932.147 238.028 932.373 234.278Z", fill: color }),
        /* @__PURE__ */ jsx("path", { d: "M931.288 159.614C931.573 156.64 931.661 150.637 933.445 148.68C934.708 153.564 934.824 158.014 935.141 163.033L935.01 164.579L934.147 164.767L931.288 159.614Z", fill: color, fillOpacity: "0.721569" }),
        /* @__PURE__ */ jsx("path", { d: "M932.19 245.334L934.391 244.501C935.4 247.366 936.489 257.092 934.671 259.44C933.504 257.24 932.801 248.834 932.19 245.334Z", fill: color, fillOpacity: "0.376471" }),
        /* @__PURE__ */ jsx("path", { d: "M933.655 126.29C937.209 128.139 935.207 138.523 934.536 141.766L933.539 141.555C932.331 139.512 933.451 129.349 933.655 126.29Z", fill: color, fillOpacity: "0.384314" }),
        /* @__PURE__ */ jsx("path", { d: "M396.193 123.916C456.557 119.454 509.186 164.694 513.999 225.181C518.813 285.668 474.005 338.701 413.698 343.891C352.878 349.124 299.426 303.735 294.571 242.731C289.717 181.726 335.313 128.415 396.193 123.916ZM335.451 198.379C358.125 217.228 396.844 243.362 426.81 246.454C447.627 250.784 454.765 251.288 475.991 252.047C477.553 195.993 460.032 129.316 390.465 133.631C358.607 141.123 339.794 166.597 335.451 198.379ZM451.9 316.039C462.69 303.825 470.523 287.786 473.078 271.677C412.041 267.154 382.762 258.029 332.623 221.374C330.113 252.746 337.23 285.264 357.605 309.795C380.815 337.739 419.552 344.073 447.707 319.807C449.13 318.578 450.528 317.322 451.9 316.039Z", fill: color }),
        /* @__PURE__ */ jsx("path", { d: "M1617.7 123.67C1745.16 111.607 1685.11 261.316 1707.34 323.72C1712.04 326.646 1717.75 328.839 1717.73 334.745C1713.85 338.87 1678.14 338.459 1672.7 334.788C1664.34 324.535 1669.44 275.13 1667.62 256.836C1651.6 311.286 1600.71 367.268 1541.41 330.191C1531.77 321.023 1524.9 313.339 1521.64 299.934C1518.2 285.722 1520.53 270.721 1528.13 258.235C1547.22 227.051 1599.84 214.927 1633.77 206.787L1632.69 206.743C1641.17 203.664 1661.62 200.664 1667.03 196.088C1669.79 190.214 1665.68 180.492 1664.04 174.446C1657.95 151.912 1638.89 141.462 1616.78 139.777C1586.97 137.507 1563.94 152.225 1543.95 172.825C1542.43 174.382 1539.32 173.981 1537.29 173.837L1536.43 172.42C1538.54 167.778 1543.65 164.181 1547.04 160.327C1566.23 138.517 1589.57 128.219 1617.7 123.67ZM1567.54 306.57C1630.6 340.547 1671.79 259.645 1667.97 206.951C1667.95 206.597 1667.23 205.376 1667.01 205.074L1664.94 204.695C1656.22 209.16 1646.97 210.397 1637.58 213.064C1609.32 221.1 1566.24 228.68 1555.73 260.844C1550.4 277.121 1554.94 294.96 1567.54 306.57Z", fill: color }),
        /* @__PURE__ */ jsx("path", { d: "M1188.15 123.687C1226.16 121.935 1264.8 134.428 1279.28 173.813C1281.65 180.264 1285.85 190.769 1283.44 197.576C1281.05 199.602 1280.3 199.905 1276.69 199.966C1260.33 200.241 1243.45 200.066 1227.13 200.074L1120.77 200.255C1118.83 230.722 1121.72 260.335 1142.43 284.666C1171.83 319.201 1231.39 323.127 1265.48 293.202C1270.44 289.823 1280.64 279.412 1283.35 278.259C1285.98 280.447 1285.27 279.567 1285.99 283.3C1285.72 284.282 1285.32 285.301 1284.73 286.134C1266.76 311.287 1237.81 334.575 1206.91 339.874C1179.81 344.641 1151.93 338.49 1129.33 322.759C1108.52 307.981 1093.95 284.334 1090.37 259.076C1080.53 189.484 1118.85 135.391 1188.15 123.687ZM1122.67 191.684C1145.18 192.725 1171.64 192.056 1194.43 192.014C1208.48 192.036 1235.85 192.851 1248.87 191.678C1240.27 155.894 1217.92 130.578 1178.63 133.83C1143.4 140.215 1131.9 158.056 1122.67 191.684Z", fill: color }),
        /* @__PURE__ */ jsx("path", { d: "M15.8416 42.8923C29.5996 42.7313 43.3592 42.7779 57.1158 43.032C61.8676 47.1478 90.2758 84.9712 96.2007 92.6516L191.835 216.675C201.36 229.094 229.408 267.598 238.907 277.437L238.909 156.268C238.906 128.638 245.364 71.3379 220.126 53.9171C216.298 51.2756 212.56 51.6038 210.384 47.5392L211.324 45.5908C219.127 41.4114 254.393 41.7716 262.542 43.7942C263.849 50.7084 250.956 60.2311 248.961 69.6899C247.596 74.478 247.515 79.7716 247.446 84.8148C246.318 168.405 248.427 252.271 246.691 335.757C246.639 338.208 245.334 339.236 243.506 340.346C239.392 338.845 240.267 338.867 237.189 335.231C232.178 330.567 202.23 290.103 196.389 282.474L96.7825 152.824C86.3351 139.151 57.3216 99.0621 46.667 88.0922C45.3 111.998 46.3953 145.996 46.3839 170.796L46.369 240.851C46.3706 262.594 44.8549 284.676 49.9351 305.875C55.2709 328.142 72.0003 324.734 75.1915 334.868L74.167 336.263C68.3087 338.239 28.0066 337.58 21.5278 336.184L20.7475 334.458C22.541 329.144 30.468 325.267 31.8724 322.093C39.8641 304.025 37.2928 271.773 37.2961 252.372L37.2675 162.899L37.4245 108.844C37.5329 79.3525 42.1375 66.4551 16.7023 48.5294L15.8416 42.8923Z", fill: color }),
        /* @__PURE__ */ jsx("path", { d: "M1866.03 123.666C1882.71 121.619 1904.7 125.908 1917.92 136.522C1944.55 157.903 1941.86 191.718 1941.77 222.14L1941.59 281.371C1941.61 293.202 1941.44 302.646 1943.97 314.322C1946.23 324.77 1958.99 328.004 1956.7 336.847C1951.02 338.179 1899.05 337.294 1891.51 336.214C1889.37 328.66 1904.72 324.339 1905.75 311.628C1906.94 293.909 1907.31 275.643 1906.77 257.854C1906.06 234.185 1908.98 207.312 1905.05 184.048C1895.26 126.003 1836.5 132.704 1799.14 161.349L1788.4 169.792C1787.97 174.846 1787.9 180.116 1787.99 185.22C1788.73 226.652 1786.32 268.584 1789.26 309.896C1789.57 314.257 1792.28 320.472 1793.97 324.535L1809.91 334.898C1800.67 337.869 1743.01 338.806 1737.02 336.087C1735.83 328.218 1746.23 326.11 1749.3 318.57C1752.12 311.623 1752.59 306.481 1752.61 299.021C1752.77 257.203 1753.75 215.174 1752.14 173.399C1751.95 168.289 1749.76 161.772 1748.14 156.879C1744.62 154.03 1736.73 150.645 1736.03 146.209C1740.88 140.162 1778.52 122.939 1786.29 125.118C1789.35 128.633 1787.77 152.442 1788.52 160.552C1808.52 142.246 1839.2 128.057 1866.03 123.666Z", fill: color }),
        /* @__PURE__ */ jsx("path", { d: "M582.34 159.573C587.913 156.949 597.939 149.791 603.556 146.154C614.567 138.959 626.406 133.125 638.816 128.782C658.543 121.795 683.392 121.162 702.279 130.281C763.104 159.648 722.018 266.083 742.277 323.58C746.23 326.496 751.276 329.45 752.7 333.932L751.65 335.781C745.679 338.366 693.495 337.854 686.42 336.336L685.277 334.246C687.665 326.245 704.518 325.432 701.961 294.472C698.84 256.695 709.096 199.661 694.132 164.816C679.031 129.648 625.126 136.333 600.902 156.665C597.669 159.379 590.604 164.423 586.786 166.36L582.964 166.175C577.146 172.078 579.011 200.338 579.009 210.078L579.156 283.471C579.229 295.673 577.744 319.881 589.655 325.794C593.165 326.575 597.985 331.474 598.96 334.918C597.584 336.2 595.794 337.294 593.927 337.155C584.709 336.466 536.809 339.225 531.999 335.941C531.767 334.315 531.509 333.755 532.317 332.301C534.89 327.671 541.327 325.352 543.796 320.787C550.823 307.791 549.394 198.137 547.616 177.516C546.984 170.196 545.175 163.427 543.104 156.422C537.375 153.019 530.148 150.734 532.41 143.772C539.971 139.175 569.3 126.55 577.929 123.839L579.985 125.231C584.368 132.539 582.626 150.254 582.34 159.573Z", fill: color }),
        /* @__PURE__ */ jsx("path", { d: "M1411.92 123.694C1431.69 121.308 1454.72 125.289 1474.2 130.642C1496.5 136.767 1500.47 158.336 1479.75 168.039C1452.26 180.913 1424.53 141.72 1401.82 132.926C1395.8 134.683 1389.65 136.434 1383.99 139.171C1338.26 161.337 1329.93 224.862 1350.61 266.779C1360.16 286.484 1377.21 301.514 1397.92 308.486C1423.89 317.238 1448.56 314.31 1472.83 302.201C1477.97 298.826 1502.6 278.761 1504.93 278.653L1505.94 280.88C1505.99 283.959 1504.34 286.914 1502.47 289.266C1483.26 313.398 1457.05 335.004 1426.22 340.016C1398.78 344.642 1370.62 338.167 1347.93 322.013C1327.43 307.221 1314.02 283.575 1309.99 258.753C1304.72 227.893 1311.91 196.2 1329.99 170.667C1350.67 141.944 1378.07 129.127 1411.92 123.694Z", fill: color }),
        /* @__PURE__ */ jsx("path", { d: "M2025.89 75.7988C2028.79 75.9122 2031.92 75.6781 2034.01 77.6638C2035.08 85.6819 2034.67 118.29 2033.67 126.49C2042.49 126.806 2092.73 124.242 2095.44 129.577L2093.67 133.899C2087.6 137.044 2044.41 134.935 2034.56 134.584C2033.08 168.818 2035.23 204.686 2034.33 239.071C2033.87 256.965 2034.09 275.884 2034.82 293.696C2035.68 314.098 2054.31 323.239 2072.61 318.026C2084.93 315.504 2099.23 297.299 2104.75 298.697C2105.82 302.048 2104.97 302.467 2103.72 306.216C2083.58 330.673 2042.67 356.74 2013.41 331.458C1995.57 316.046 1999.13 263.322 1999.14 240.284L1999.12 134.774C1992.45 134.936 1977.97 136.048 1972.61 133.019L1972.32 130.765C1976.24 122.07 2017.08 83.203 2025.89 75.7988Z", fill: color }),
        /* @__PURE__ */ jsx("path", { d: "M2119.24 320.667C2119.1 313.273 2115.52 273.749 2116.73 270.235L2119.34 269.383C2120.94 269.833 2122.84 271.376 2123.52 272.715C2128.92 283.793 2133.38 292.109 2141.61 301.624C2160.67 323.931 2193.16 338.894 2222.37 330.201C2241.69 325.759 2256.55 301.591 2248.02 282.437C2227.68 236.787 2140.53 252.328 2123.5 201.175C2118.93 187.371 2119.95 172.318 2126.35 159.26C2133.54 144.898 2149.43 132.788 2164.12 127.875C2166.13 128.007 2183.55 128.579 2183.92 128.739C2179.79 130.893 2176.12 131.432 2173.11 133.407C2154.8 139.049 2139.51 151.831 2145.4 172.444C2156.53 211.349 2222.44 210.285 2251.11 231.975C2262.51 240.593 2270.06 248.819 2272.79 263.478C2284.15 353.068 2170.13 354.932 2119.24 320.667Z", fill: color }),
        /* @__PURE__ */ jsx("path", { d: "M362.099 37.4527C376.617 36.6907 401.156 36.969 415.664 37.6666C417.144 53.0732 416.676 68.6349 418.317 84.034C419.284 93.1167 419.981 102.21 420.335 111.335C415.437 111.598 406.376 110.818 401.185 110.519C394.905 110.53 391.44 110.617 385.309 111.565C376.51 112.926 362.867 120.278 354.99 118.523C352.478 106.58 351.021 65.6033 350.258 51.1591C349.993 46.1303 357.871 40.3562 362.099 37.4527ZM386.459 73.368C393.423 71.9582 397.923 65.1504 396.506 58.1716C395.087 51.1928 388.288 46.6925 381.329 48.1259C374.387 49.5559 369.912 56.3515 371.326 63.3135C372.741 70.2754 379.512 74.7742 386.459 73.368Z", fill: color }),
        /* @__PURE__ */ jsx("path", { d: "M382.218 54.6738C387.531 55.1818 388.744 54.7816 390.485 59.7457C389.68 62.9706 388.952 63.5437 386.517 65.8363L381.386 64.5843C379.063 62.5045 378.387 62.0023 377.859 58.9522C379.451 55.4547 378.535 56.4747 382.218 54.6738Z", fill: color, fillOpacity: "0.988235" }),
        /* @__PURE__ */ jsx("path", { d: "M421.089 36.7474C428.417 36.4402 438.479 35.2971 443.751 40.8562C450.41 61.5694 446.568 93.7353 446.597 115.851C446.603 120.688 429.125 116.885 426.693 105.279C424.691 95.7277 426.596 62.5691 421.932 56.3422C420.891 50.6181 421.114 42.7241 421.089 36.7474Z", fill: color }),
        /* @__PURE__ */ jsx("path", { d: "M806.722 56.0078L809.634 56.2853C819.986 71.2184 816.721 161.618 816.719 186.893L816.669 255.797C816.64 275.358 816.794 294.702 813.883 314.204C812.816 321.348 806.041 329.715 800.569 334.286L891.543 334.347C912.376 334.224 926.28 336.344 946.42 329.621C953.746 327.176 971.954 321.327 978.562 321.975C967.674 327.667 946.402 334.778 934.645 335.687C911.518 337.475 810.935 339.685 793.808 335.332C799.946 329.881 807.225 324.854 810.142 316.851C814.345 305.318 813.984 95.9763 812.118 73.9049C811.564 67.3576 809.448 61.9245 806.722 56.0078Z", fill: color, fillOpacity: "0.968627" }),
        /* @__PURE__ */ jsx("path", { d: "M2201.49 132.256C2199.5 130.308 2193.31 129.948 2190.25 129.593C2197.57 129.653 2195.89 125.93 2205.79 125.753C2214.2 125.604 2228.99 128.615 2236.39 127.673C2243.25 128.23 2257.78 133.147 2263.8 136.336C2264.09 145.454 2266.26 171.919 2262.74 178.95L2260.84 179.619C2258.03 177.794 2254.74 172.561 2252.84 169.578C2237.55 145.607 2228.81 139.486 2201.49 132.256Z", fill: color }),
        /* @__PURE__ */ jsx("path", { d: "M589.655 325.793C577.743 319.88 579.228 295.672 579.156 283.471L579.008 210.077C579.011 200.337 577.145 172.078 582.963 166.175L586.785 166.359C583.026 169.834 582.729 170.987 582.628 176.753C582.153 203.827 582.517 230.679 582.548 257.807C582.568 275.595 582.183 294.696 583.754 312.438C583.935 314.478 588.457 323.389 589.655 325.793Z", fill: color, fillOpacity: "0.968627" }),
        /* @__PURE__ */ jsx("path", { d: "M443.751 40.8564C449.152 45.6472 450.788 50.8876 450.644 58.0729C450.266 76.8951 451.976 106.59 450.117 124.585C440.622 119.83 435.82 117.733 425.526 114.385C423.816 95.1415 421.861 75.6675 421.932 56.3424C426.596 62.5693 424.691 95.728 426.693 105.279C429.125 116.885 446.603 120.688 446.597 115.851C446.568 93.7355 450.41 61.5696 443.751 40.8564Z", fill: color, fillOpacity: "0.94902" }),
        /* @__PURE__ */ jsx("path", { d: "M2164.12 127.875C2182.59 123.688 2219.27 120.265 2236.39 127.673C2228.99 128.615 2214.2 125.604 2205.79 125.753C2195.89 125.929 2197.57 129.652 2190.25 129.592C2193.31 129.948 2199.5 130.307 2201.49 132.255C2192.61 132.322 2181.78 132.251 2173.11 133.407C2176.12 131.432 2179.79 130.893 2183.92 128.739C2183.55 128.579 2166.13 128.008 2164.12 127.875Z", fill: color, fillOpacity: "0.929412" })
      ] })
    }
  );
}

function useCartHook() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());
  const isDrawerOpen = useCartStore((s) => s.isDrawerOpen);
  const setDrawerOpen = useCartStore((s) => s.setDrawerOpen);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const clearCart = useCartStore((s) => s.clearCart);
  const hasHydrated = useCartStore((s) => s._hasHydrated);
  return { items, total, isDrawerOpen, setDrawerOpen, removeItem, updateQty, clearCart, hasHydrated };
}

function CartItem({ item, onRemove, onQtyChange }) {
  const isCombo = item.comboId != null;
  const variantLabel = isCombo ? `Combo · ${item.comboProducts?.length ?? 0} productos` : item.ml >= 30 ? `${item.ml} ml Botella original` : `${item.ml}ml Decant`;
  return /* @__PURE__ */ jsxs("div", { className: "flex gap-4 py-5", children: [
    /* @__PURE__ */ jsx("div", { className: "w-20 h-24 shrink-0 bg-gray-50 rounded-lg overflow-hidden", children: item.image ? /* @__PURE__ */ jsx("img", { src: item.image, alt: item.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-gray-400", children: /* @__PURE__ */ jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1", children: [
      /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }),
      /* @__PURE__ */ jsx("circle", { cx: "8.5", cy: "8.5", r: "1.5" }),
      /* @__PURE__ */ jsx("polyline", { points: "21 15 16 10 5 21" })
    ] }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-black leading-snug line-clamp-2", children: item.name }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => onRemove(item.variantId),
            className: "p-1 text-gray-400 hover:text-error transition-colors shrink-0",
            "aria-label": "Eliminar",
            children: /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: [
              /* @__PURE__ */ jsx("polyline", { points: "3 6 5 6 21 6" }),
              /* @__PURE__ */ jsx("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("span", { className: "inline-block mt-1.5 px-2.5 py-1 text-xs font-bold text-black border border-gray-200 rounded", children: variantLabel }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-2", children: [
        isCombo ? /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-black select-none", children: [
          "Cant: ",
          item.quantity
        ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-0", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => onQtyChange(item.variantId, item.quantity - 1),
              className: "w-7 h-7 flex items-center justify-center border border-gray-200 text-gray-400 hover:text-black hover:border-black transition-colors rounded-l text-sm",
              children: "−"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "w-8 h-7 flex items-center justify-center border-y border-gray-200 text-xs font-bold text-black select-none", children: item.quantity }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => onQtyChange(item.variantId, item.quantity + 1),
              className: "w-7 h-7 flex items-center justify-center border border-gray-200 text-gray-400 hover:text-black hover:border-black transition-colors rounded-r text-sm",
              children: "+"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-black", children: formatCurrency(item.price * item.quantity) })
      ] })
    ] })
  ] });
}

function PaymentMethodIcons() {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 flex-wrap", children: [
    /* @__PURE__ */ jsx("div", { className: "h-9 border border-gray-200 rounded-md px-2.5 flex items-center justify-center bg-orange-500 text-white font-bold text-[10px] italic", children: "ACEPTAMOS PayPhone" }),
    /* @__PURE__ */ jsx("div", { className: "h-9 w-12 border border-gray-200 rounded-md flex items-center justify-center bg-white", children: /* @__PURE__ */ jsx("span", { className: "text-blue-800 font-bold text-[11px] italic", children: "VISA" }) }),
    /* @__PURE__ */ jsx("div", { className: "h-9 w-12 border border-gray-200 rounded-md flex items-center justify-center bg-white", children: /* @__PURE__ */ jsx("div", { className: "w-5 h-5 rounded-full border-2 border-blue-500 overflow-hidden flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-2.5 h-6 bg-blue-500 skew-x-12" }) }) }),
    /* @__PURE__ */ jsx("div", { className: "h-9 w-14 border border-gray-200 rounded-md flex items-center justify-center bg-white", children: /* @__PURE__ */ jsx("span", { className: "text-orange-500 font-bold text-[9px]", children: "DISCOVER" }) }),
    /* @__PURE__ */ jsx("div", { className: "h-9 border border-gray-200 rounded-md px-2.5 flex items-center justify-center bg-white", children: /* @__PURE__ */ jsx("span", { className: "text-gray-600 font-bold text-[9px]", children: "Transferencia Bancaria" }) })
  ] });
}

const ESTIMATED_SHIPPING = 3;

function mapBackendAuthResponse(backendData) {
  return {
    access_token: backendData.accessToken,
    refresh_token: "",
    user: {
      id: String(backendData.user.id),
      name: `${backendData.user.firstName} ${backendData.user.lastName}`.trim(),
      email: backendData.user.email,
      role: backendData.user.role,
      isEmailVerified: backendData.user.isEmailVerified ?? false
    }
  };
}
const authService = {
  login: async (payload) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.LOGIN, payload);
    return mapBackendAuthResponse(data?.data ?? data);
  },
  register: async (payload) => {
    const body = {
      email: payload.email,
      password: payload.password,
      firstName: payload.firstName,
      lastName: payload.lastName
    };
    console.log("[DEBUG register] URL:", API_ENDPOINTS.REGISTER, "body:", body);
    try {
      const { data } = await axiosInstance.post(API_ENDPOINTS.REGISTER, body);
      console.log("[DEBUG register] response:", data);
      return data?.data ?? data;
    } catch (err) {
      console.error("[DEBUG register] error:", err?.response?.status, err?.response?.data, err?.message);
      throw err;
    }
  },
  logout: async () => {
  },
  forgotPassword: async (email) => {
    await axiosInstance.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
  },
  resetPassword: async (token, newPassword) => {
    await axiosInstance.post(API_ENDPOINTS.RESET_PASSWORD, { token, newPassword });
  },
  verifyEmail: async (token) => {
    const { data } = await axiosInstance.get(`${API_ENDPOINTS.VERIFY_EMAIL}?token=${token}`);
    return data?.data ?? data;
  },
  resendVerification: async (email) => {
    await axiosInstance.post(API_ENDPOINTS.RESEND_VERIFICATION, { email });
  },
  googleAuth: async (idToken) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.GOOGLE_AUTH, { idToken });
    return mapBackendAuthResponse(data?.data ?? data);
  }
};

const applyAuthSuccess = (data, keepSession) => {
  const decoded = JSON.parse(atob(data.access_token.split(".")[1]));
  const expiration = decoded.exp * 1e3;
  useAuthStore.getState().setToken(data.access_token, data.refresh_token, expiration);
  useAuthStore.getState().setUser(data.user);
  secureStorage.setItem("keepSession", String(keepSession));
};

function useLoginMutation(onSuccess) {
  return useMutation({
    mutationFn: (payload) => authService.login(payload),
    onSuccess: (data, variables) => {
      applyAuthSuccess(data, variables.keepSession ?? false);
      sonnerResponse("¡Bienvenido!", "success");
      onSuccess?.();
    },
    onError: (error) => {
      sonnerResponse("Correo o contraseña incorrectos.", "error");
    }
  });
}

function useGoogleAuth(onSuccess) {
  const handleGoogleSuccess = useCallback(
    async (credentialResponse) => {
      try {
        const idToken = credentialResponse.credential;
        const authResponse = await authService.googleAuth(idToken);
        applyAuthSuccess(authResponse, false);
        sonnerResponse("¡Bienvenido!", "success");
        onSuccess?.();
      } catch (error) {
        console.error("Google auth error:", error);
        sonnerResponse("Error al autenticar con Google", "error");
      }
    },
    [onSuccess]
  );
  const handleGoogleError = useCallback(() => {
    sonnerResponse("Error al autenticar con Google", "error");
  }, []);
  return { handleGoogleSuccess, handleGoogleError };
}

const AUTH_INPUT_CLASS = "w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors";
const AUTH_SUBMIT_CLASS = "w-full py-3.5 bg-black text-white font-heading font-bold text-sm uppercase tracking-wider rounded-full hover:bg-black/85 transition-colors disabled:opacity-60";

function EyeIcon({ width = 18, height = 18 }) {
  return /* @__PURE__ */ jsxs("svg", { width, height, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", "aria-hidden": true, children: [
    /* @__PURE__ */ jsx("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }),
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "3" })
  ] });
}

function EyeOffIcon({ width = 18, height = 18 }) {
  return /* @__PURE__ */ jsxs("svg", { width, height, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", "aria-hidden": true, children: [
    /* @__PURE__ */ jsx("path", { d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" }),
    /* @__PURE__ */ jsx("line", { x1: "1", y1: "1", x2: "23", y2: "23" })
  ] });
}

function LoginForm({ onSuccess, onSwitchToRegister, onSwitchToForgot }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepSession, setKeepSession] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLoginMutation(onSuccess);
  const { handleGoogleSuccess, handleGoogleError } = useGoogleAuth(onSuccess);
  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password, keepSession });
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h2", { className: "font-heading text-xl font-bold text-black text-center mb-1", children: "Iniciar Sesión" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 text-center mb-6", children: "Para poder comprar logueate con tu cuenta" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs text-gray-500 mb-1.5", children: "Email" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            placeholder: "tu@email.com",
            required: true,
            className: AUTH_INPUT_CLASS
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs text-gray-500 mb-1.5", children: "Password" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: showPassword ? "text" : "password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              placeholder: "••••••••",
              required: true,
              className: `${AUTH_INPUT_CLASS} pr-10`
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowPassword(!showPassword),
              className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black",
              children: showPassword ? /* @__PURE__ */ jsx(EyeOffIcon, {}) : /* @__PURE__ */ jsx(EyeIcon, {})
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: keepSession,
              onChange: (e) => setKeepSession(e.target.checked),
              className: "w-4 h-4 accent-black rounded"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: "Mantenerme conectad@" })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onSwitchToForgot,
            className: "text-xs text-gray-500 hover:text-black transition-colors",
            children: "Olvidé mi contraseña"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: isPending,
          className: AUTH_SUBMIT_CLASS,
          children: isPending ? /* @__PURE__ */ jsx(Loader, { size: 18, color: "#fff", className: "mx-auto" }) : "Login"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 my-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-1 h-px bg-gray-200" }),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: "or" }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 h-px bg-gray-200" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(
        GoogleLogin,
        {
          onSuccess: handleGoogleSuccess,
          onError: handleGoogleError,
          text: "signin_with",
          size: "large",
          theme: "light"
        }
      ) }),
      /* @__PURE__ */ jsxs("p", { className: "text-center text-sm text-gray-500 mt-2", children: [
        "¿No tienes cuenta?",
        " ",
        /* @__PURE__ */ jsx("button", { type: "button", onClick: onSwitchToRegister, className: "text-black font-medium hover:underline", children: "Regístrate" })
      ] })
    ] })
  ] });
}

function useRegisterMutation(onSuccess) {
  return useMutation({
    mutationFn: (payload) => authService.register(payload),
    onSuccess: () => {
      sonnerResponse("¡Cuenta creada! Revisa tu email para verificar tu cuenta.", "success");
      onSuccess?.();
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || error?.response?.data?.data?.message || "Error al crear la cuenta. El correo puede estar en uso.";
      sonnerResponse(msg, "error");
    }
  });
}

function RegisterForm({ onSuccess, onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [sent, setSent] = useState(false);
  const [resending, setResending] = useState(false);
  const { mutate: register, isPending } = useRegisterMutation(() => setSent(true));
  const { handleGoogleSuccess, handleGoogleError } = useGoogleAuth(onSuccess);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    register({ firstName: name, lastName, email, password });
  };
  const handleResend = async () => {
    setResending(true);
    try {
      await authService.resendVerification(email);
      sonnerResponse("Email de verificación reenviado.", "success");
    } catch {
      sonnerResponse("Error al reenviar. Intenta de nuevo.", "error");
    } finally {
      setResending(false);
    }
  };
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  if (sent) {
    return /* @__PURE__ */ jsxs("div", { className: "text-center py-6", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100", children: /* @__PURE__ */ jsx("svg", { className: "h-7 w-7 text-success", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M5 13l4 4L19 7" }) }) }),
      /* @__PURE__ */ jsx("h2", { className: "font-heading text-xl font-bold text-black mb-2", children: "Revisa tu bandeja de entrada" }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 mb-6", children: [
        "Te enviamos un enlace de verificación a ",
        /* @__PURE__ */ jsx("strong", { className: "text-black", children: email })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: handleResend,
          disabled: resending,
          className: "text-sm text-gray-500 hover:text-black underline mb-4 block mx-auto",
          children: resending ? "Reenviando..." : "¿No lo recibiste? Reenviar email"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onSwitchToLogin,
          className: "text-sm text-black font-medium hover:underline",
          children: "Volver al login"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h2", { className: "font-heading text-xl font-bold text-black text-center mb-1", children: "Crear cuenta" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 text-center mb-6", children: "Regístrate para empezar a comprar" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-3.5", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs text-gray-500 mb-1.5", children: "Nombre" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: name,
              onChange: (e) => setName(e.target.value),
              placeholder: "Juan",
              required: true,
              className: AUTH_INPUT_CLASS
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs text-gray-500 mb-1.5", children: "Apellido" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: lastName,
              onChange: (e) => setLastName(e.target.value),
              placeholder: "Pérez",
              required: true,
              className: AUTH_INPUT_CLASS
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs text-gray-500 mb-1.5", children: "Email" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            placeholder: "tu@email.com",
            required: true,
            className: AUTH_INPUT_CLASS
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs text-gray-500 mb-1.5", children: "Teléfono" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "tel",
            value: phone,
            onChange: (e) => setPhone(e.target.value),
            placeholder: "09X XXX XXXX",
            className: AUTH_INPUT_CLASS
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs text-gray-500 mb-1.5", children: "Contraseña" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: showPassword ? "text" : "password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              placeholder: "Mínimo 6 caracteres",
              required: true,
              minLength: 6,
              className: `${AUTH_INPUT_CLASS} pr-10`
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowPassword(!showPassword),
              className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black",
              children: showPassword ? /* @__PURE__ */ jsx(EyeOffIcon, {}) : /* @__PURE__ */ jsx(EyeIcon, {})
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs text-gray-500 mb-1.5", children: "Confirmar contraseña" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: showPassword ? "text" : "password",
            value: confirmPassword,
            onChange: (e) => setConfirmPassword(e.target.value),
            placeholder: "Repite tu contraseña",
            required: true,
            minLength: 6,
            className: `w-full px-4 py-3 border rounded-lg text-sm text-black placeholder:text-gray-500 focus:outline-none transition-colors ${passwordMismatch ? "border-error focus:border-error" : "border-gray-300 focus:border-black"}`
          }
        ),
        passwordMismatch && /* @__PURE__ */ jsx("p", { className: "text-xs text-error mt-1", children: "Las contraseñas no coinciden" })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: isPending || passwordMismatch,
          className: AUTH_SUBMIT_CLASS,
          children: isPending ? /* @__PURE__ */ jsx(Loader, { size: 18, color: "#fff", className: "mx-auto" }) : "Crear cuenta"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 my-1", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-1 h-px bg-gray-200" }),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: "or" }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 h-px bg-gray-200" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(
        GoogleLogin,
        {
          onSuccess: handleGoogleSuccess,
          onError: handleGoogleError,
          text: "signup_with",
          size: "large",
          theme: "light"
        }
      ) }),
      /* @__PURE__ */ jsxs("p", { className: "text-center text-sm text-gray-500 mt-1", children: [
        "¿Ya tienes cuenta?",
        " ",
        /* @__PURE__ */ jsx("button", { type: "button", onClick: onSwitchToLogin, className: "text-black font-medium hover:underline", children: "Ingresar" })
      ] })
    ] })
  ] });
}

function useForgotPasswordMutation(onSuccess) {
  return useMutation({
    mutationFn: (email) => authService.forgotPassword(email),
    onSuccess: () => {
      onSuccess?.();
    },
    onError: () => {
      sonnerResponse("Error al enviar el enlace. Intenta de nuevo.", "error");
    }
  });
}

function useForgotPasswordHook() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const { mutate: sendResetLink, isPending } = useForgotPasswordMutation(() => {
    setSent(true);
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    sendResetLink(email);
  };
  return { email, setEmail, sent, isPending, handleSubmit };
}

function ForgotPasswordForm({ onSwitchToLogin }) {
  const { email, setEmail, sent, isPending, handleSubmit } = useForgotPasswordHook();
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h2", { className: "font-heading text-xl font-bold text-black text-center mb-1", children: "Recuperar contraseña" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 text-center mb-6", children: sent ? "Revisa tu bandeja de entrada" : "Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña" }),
    sent ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-5", children: [
      /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-full bg-green-100 flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "#22c55e", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" }) }) }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 text-center max-w-xs", children: [
        "Si el email ",
        /* @__PURE__ */ jsx("span", { className: "font-medium text-black", children: email }),
        " está registrado, recibirás un enlace para restablecer tu contraseña."
      ] }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: onSwitchToLogin, className: AUTH_SUBMIT_CLASS, children: "Volver al login" })
    ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs text-gray-500 mb-1.5", children: "Email" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            placeholder: "tu@email.com",
            required: true,
            className: AUTH_INPUT_CLASS
          }
        )
      ] }),
      /* @__PURE__ */ jsx("button", { type: "submit", disabled: isPending, className: AUTH_SUBMIT_CLASS, children: isPending ? /* @__PURE__ */ jsx(Loader, { size: 18, color: "#fff", className: "mx-auto" }) : "Enviar enlace" }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: onSwitchToLogin,
          className: "w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-black transition-colors",
          children: [
            /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("polyline", { points: "15 18 9 12 15 6" }) }),
            "Volver al login"
          ]
        }
      )
    ] })
  ] });
}

function AuthModal({ open, onClose }) {
  const [mode, setMode] = useState("login");
  if (!open) return null;
  const handleClose = () => {
    onClose();
    setTimeout(() => setMode("login"), 300);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm",
        onClick: handleClose,
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4",
        role: "dialog",
        "aria-modal": "true",
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: "relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: handleClose,
                  className: "absolute top-4 right-4 z-10 p-1.5 text-gray-400 hover:text-black transition-colors",
                  "aria-label": "Cerrar",
                  children: /* @__PURE__ */ jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                    /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                    /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 px-8 py-10 sm:px-12 sm:py-12 overflow-y-auto max-h-[90vh]", children: [
                /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx("span", { className: "font-heading text-2xl tracking-wide text-black", children: "NönDecants" }) }),
                mode === "login" && /* @__PURE__ */ jsx(
                  LoginForm,
                  {
                    onSuccess: handleClose,
                    onSwitchToRegister: () => setMode("register"),
                    onSwitchToForgot: () => setMode("forgot")
                  }
                ),
                mode === "register" && /* @__PURE__ */ jsx(
                  RegisterForm,
                  {
                    onSuccess: handleClose,
                    onSwitchToLogin: () => setMode("login")
                  }
                ),
                mode === "forgot" && /* @__PURE__ */ jsx(
                  ForgotPasswordForm,
                  {
                    onSwitchToLogin: () => setMode("login")
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "hidden md:block md:w-[320px] lg:w-[360px] shrink-0 relative", children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: "/loginbanner.png",
                    alt: "",
                    className: "absolute inset-0 w-full h-full object-cover"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 bg-black/40 flex flex-col items-center justify-between py-8 px-6", children: [
                  /* @__PURE__ */ jsx("img", { src: "/logo.svg", alt: "NönDecants", className: "h-6" }),
                  /* @__PURE__ */ jsx("p", { className: "text-white/90 text-xs text-center font-medium leading-relaxed", children: "100% Compra segura aprovecha nuestros descuentos, compra con confianza" })
                ] })
              ] })
            ]
          }
        )
      }
    )
  ] });
}

function CartSummary({ total, onClose }) {
  const estimatedTotal = total + ESTIMATED_SHIPPING;
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [showAuth, setShowAuth] = useState(false);
  const handleCheckout = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowAuth(true);
    } else {
      onClose();
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "px-6 pb-6 pt-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-200 pt-4 space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-black", children: "Subtotal" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-black", children: formatCurrency(total) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500 font-medium", children: "Impuestos y Envío" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500 font-medium", children: formatCurrency(ESTIMATED_SHIPPING) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-2 border-t border-gray-200", children: [
        /* @__PURE__ */ jsx("span", { className: "text-base font-bold text-black", children: "Total" }),
        /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-black", children: formatCurrency(estimatedTotal) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-5", children: /* @__PURE__ */ jsx(PaymentMethodIcons, {}) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-7 space-y-3", children: [
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/checkout",
          onClick: handleCheckout,
          className: "block w-full text-center py-3.5 bg-black text-white font-heading text-sm font-bold uppercase tracking-widest rounded-full hover:bg-neutral-800 transition-colors",
          children: "Proceder al pago"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "block w-full text-center py-3.5 border-2 border-black text-black font-heading text-sm font-bold uppercase tracking-widest rounded-full hover:bg-gray-50 transition-colors",
          children: "Seguir comprando"
        }
      )
    ] }),
    /* @__PURE__ */ jsx(AuthModal, { open: showAuth, onClose: () => setShowAuth(false) })
  ] });
}

function CartDrawer() {
  const { items, total, isDrawerOpen, setDrawerOpen, removeItem, updateQty, hasHydrated } = useCartHook();
  const itemCount = useCartStore((s) => s.itemCount());
  if (!hasHydrated || !isDrawerOpen) return null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-50 bg-black/50",
        onClick: () => setDrawerOpen(false),
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white flex flex-col shadow-2xl",
        role: "dialog",
        "aria-label": "Carrito de compras",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-5 border-b border-gray-200", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-heading text-xl font-bold text-black", children: "Tu pedido" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setDrawerOpen(false),
                className: "p-2 text-gray-400 hover:text-black transition-colors",
                "aria-label": "Cerrar carrito",
                children: /* @__PURE__ */ jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                  /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                  /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                ] })
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto px-6", children: items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-full gap-4 text-center", children: [
            /* @__PURE__ */ jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "0.75", className: "text-gray-400", children: [
              /* @__PURE__ */ jsx("path", { d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" }),
              /* @__PURE__ */ jsx("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
              /* @__PURE__ */ jsx("path", { d: "M16 10a4 4 0 0 1-8 0" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm", children: "Tu carrito está vacío." }),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "/catalogo",
                onClick: () => setDrawerOpen(false),
                className: "text-accent text-sm font-medium hover:underline",
                children: "Explorar catálogo"
              }
            )
          ] }) : /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-200", children: items.map((item) => /* @__PURE__ */ jsx(
            CartItem,
            {
              item,
              onRemove: removeItem,
              onQtyChange: updateQty
            },
            item.variantId
          )) }) }),
          items.length > 0 && /* @__PURE__ */ jsx(
            CartSummary,
            {
              total,
              itemCount,
              onClose: () => setDrawerOpen(false)
            }
          )
        ]
      }
    )
  ] });
}

function CartDrawerIsland() {
  return /* @__PURE__ */ jsx(CartDrawer, {});
}

function AuthModalIsland({ open, onClose }) {
  return /* @__PURE__ */ jsx(AuthModal, { open, onClose });
}

const NAV_LINKS = [
  { href: "/", label: "Inicio", exact: true, dropdown: false, dropdownId: "" },
  { href: "/catalogo/perfumes", label: "Perfumes", exact: true, dropdown: true, dropdownId: "perfumes" },
  { href: "/catalogo/combos", label: "Combos", exact: true, dropdown: false, dropdownId: "" },
  { href: "/bajo-pedido", label: "Bajo Pedido", exact: true, dropdown: true, dropdownId: "bajoPedido" },
  { href: "/blog", label: "Blog", exact: true, dropdown: false, dropdownId: "" },
  { href: "/rastrear", label: "Rastrear tú pedido", exact: true, dropdown: false, dropdownId: "" }
];
function isLinkActive(href, currentUrl, exact) {
  if (href.startsWith("#")) return false;
  const currentPathname = currentUrl.split("?")[0];
  if (exact) {
    return currentPathname === href;
  }
  return currentPathname.startsWith(href);
}
function useNavbarHook() {
  const itemCount = useCartStore((s) => s.itemCount());
  const setDrawerOpen = useCartStore((s) => s.setDrawerOpen);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [pathname, setPathname] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  useEffect(() => {
    const updatePathname = () => {
      const url = window.location.pathname + window.location.search;
      setPathname(url);
    };
    updatePathname();
    window.addEventListener("popstate", updatePathname);
    window.addEventListener("hashchange", updatePathname);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("popstate", updatePathname);
      window.removeEventListener("hashchange", updatePathname);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    if (!openDropdown) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpenDropdown(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openDropdown]);
  const handleDropdownEnter = (dropdownId) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setOpenDropdown(dropdownId);
    setActiveCategory(0);
  };
  const handleDropdownLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };
  const handleDropdownContentEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  };
  const handleDropdownContentLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };
  return {
    itemCount,
    setDrawerOpen,
    isAuthenticated,
    authOpen,
    setAuthOpen,
    mobileOpen,
    setMobileOpen,
    openDropdown,
    setOpenDropdown,
    activeCategory,
    setActiveCategory,
    dropdownRef,
    pathname,
    isScrolled,
    handleDropdownEnter,
    handleDropdownLeave,
    handleDropdownContentEnter,
    handleDropdownContentLeave
  };
}

function mapCategories(raw, bajoPedido) {
  return raw.map((c) => ({
    id: String(c.id),
    name: c.name,
    slug: c.slug ?? c.name.toLowerCase(),
    description: c.description ?? "",
    imageUrl: c.imageUrl ?? null,
    bajoPedido: c.bajoPedido ?? false,
    marcas: (c.marcas ?? []).filter((s) => s.isActive !== false).filter((s) => bajoPedido === void 0 || (s.bajoPedido ?? false) === bajoPedido).map((s) => ({
      id: String(s.id),
      name: s.name,
      slug: s.slug ?? s.name.toLowerCase(),
      imageUrl: s.imageUrl ?? null
    }))
  }));
}
const useCategoriesQuery = (bajoPedido) => useQuery({
  queryKey: ["categories", bajoPedido ?? "all"],
  queryFn: async () => {
    const params = {};
    if (bajoPedido !== void 0) params.bajoPedido = String(bajoPedido);
    const { data } = await axiosInstance.get(API_ENDPOINTS.CATEGORIES, { params });
    const raw = data?.data?.data ?? data?.data ?? data ?? [];
    if (!Array.isArray(raw)) return [];
    return mapCategories(raw, bajoPedido);
  },
  staleTime: 5 * 6e4,
  retry: 1
});
const useCategoriesWithMarcasQuery = () => useCategoriesQuery();
const useNormalCategoriesQuery = () => useCategoriesQuery();
const useBajoPedidoCategoriesQuery = () => useCategoriesQuery(true);

function PerfumeDropdown({
  activeCategory,
  setActiveCategory,
  onClose,
  dropdownRef,
  onMouseEnter,
  onMouseLeave
}) {
  const { data: categories = [] } = useBajoPedidoCategoriesQuery();
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: dropdownRef,
      className: "absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 hidden md:block",
      onMouseEnter,
      onMouseLeave,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: "rounded-2xl overflow-hidden shadow-2xl w-[520px] bg-cover bg-center bg-no-repeat",
          style: { backgroundImage: "url('/footer.png')" },
          children: [
            /* @__PURE__ */ jsx("div", { className: "px-10 pt-7 pb-4", children: /* @__PURE__ */ jsxs("h3", { className: "font-heading text-xl font-bold tracking-widest uppercase text-white text-center", children: [
              "BAJO ",
              /* @__PURE__ */ jsx("span", { className: "text-accent", children: "PEDIDO" })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-col pb-6 px-4", children: categories.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-center text-base text-white/50 py-4", children: "No hay categorías bajo pedido" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { className: "relative py-1", children: /* @__PURE__ */ jsx(
                "a",
                {
                  href: "/bajo-pedido",
                  onClick: onClose,
                  className: "relative block w-full text-center py-3 font-heading text-lg font-bold tracking-wider uppercase text-accent hover:text-white transition-colors z-10",
                  children: "Ver Todos"
                }
              ) }),
              categories.filter((c) => c.name.toLowerCase() !== "all").map((cat, idx) => {
                const isActive = activeCategory === idx;
                return /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("div", { className: "relative py-1", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => setActiveCategory(isActive ? -1 : idx),
                        onMouseEnter: () => setActiveCategory(idx),
                        className: [
                          "relative w-full text-center py-3 font-heading text-lg font-bold tracking-wider uppercase transition-colors z-10",
                          isActive ? "text-white" : "text-white/80 hover:text-white"
                        ].join(" "),
                        children: cat.name
                      }
                    ),
                    isActive && /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "absolute inset-y-1 inset-x-0",
                        style: {
                          background: "rgba(255,255,255,0.12)",
                          clipPath: "polygon(0% 0%, 100% 0%, 96% 50%, 100% 100%, 0% 100%, 4% 50%)"
                        }
                      }
                    )
                  ] }),
                  isActive && cat.marcas.length > 0 && /* @__PURE__ */ jsx("div", { className: "px-6 py-3", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-x-6 gap-y-3 justify-center", children: cat.marcas.map((sub) => /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: `/bajo-pedido?category=${cat.id}&marca=${sub.id}`,
                      onClick: onClose,
                      className: "text-base text-white/80 hover:text-accent transition-colors flex items-center gap-2",
                      children: [
                        /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0" }),
                        sub.name
                      ]
                    },
                    sub.id
                  )) }) })
                ] }, cat.id);
              })
            ] }) })
          ]
        }
      )
    }
  );
}

function PerfumesMenuDropdown({
  activeCategory,
  setActiveCategory,
  onClose,
  dropdownRef,
  onMouseEnter,
  onMouseLeave
}) {
  const { data: categories = [], isLoading } = useNormalCategoriesQuery();
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: dropdownRef,
      className: "absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 hidden md:block",
      onMouseEnter,
      onMouseLeave,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: "rounded-2xl overflow-hidden shadow-2xl w-[520px] bg-cover bg-center bg-no-repeat",
          style: { backgroundImage: "url('/footer.png')" },
          children: [
            /* @__PURE__ */ jsx("div", { className: "px-10 pt-7 pb-4", children: /* @__PURE__ */ jsxs("h3", { className: "font-heading text-xl font-bold tracking-widest uppercase text-white text-center", children: [
              "PERFUMES ",
              /* @__PURE__ */ jsx("span", { className: "text-accent", children: "NONDECANTS" })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-col pb-6 px-4", children: isLoading ? /* @__PURE__ */ jsx("p", { className: "text-center text-base text-white/50 py-4", children: "Cargando..." }) : categories.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-center text-base text-white/50 py-4", children: "No hay categorías disponibles" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { className: "relative py-1", children: /* @__PURE__ */ jsx(
                "a",
                {
                  href: "/catalogo/perfumes",
                  onClick: onClose,
                  className: "relative block w-full text-center py-3 font-heading text-lg font-bold tracking-wider uppercase text-accent hover:text-white transition-colors z-10",
                  children: "Ver Todos"
                }
              ) }),
              categories.filter((c) => c.name.toLowerCase() !== "all").map((cat, idx) => {
                const isActive = activeCategory === idx;
                return /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("div", { className: "relative py-1", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => setActiveCategory(isActive ? -1 : idx),
                        onMouseEnter: () => setActiveCategory(idx),
                        className: [
                          "relative w-full text-center py-3 font-heading text-lg font-bold tracking-wider uppercase transition-colors z-10",
                          isActive ? "text-white" : "text-white/80 hover:text-white"
                        ].join(" "),
                        children: cat.name
                      }
                    ),
                    isActive && /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "absolute inset-y-1 inset-x-0",
                        style: {
                          background: "rgba(255,255,255,0.12)",
                          clipPath: "polygon(0% 0%, 100% 0%, 96% 50%, 100% 100%, 0% 100%, 4% 50%)"
                        }
                      }
                    )
                  ] }),
                  isActive && cat.marcas.length > 0 && /* @__PURE__ */ jsx("div", { className: "px-6 py-3", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-x-6 gap-y-3 justify-center", children: cat.marcas.map((sub) => /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: `/catalogo/perfumes?category=${cat.id}&marca=${sub.id}`,
                      onClick: onClose,
                      className: "text-base text-white/80 hover:text-accent transition-colors flex items-center gap-2",
                      children: [
                        /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0" }),
                        sub.name
                      ]
                    },
                    sub.id
                  )) }) })
                ] }, cat.id);
              })
            ] }) })
          ]
        }
      )
    }
  );
}

function MobileMenu({ pathname, isAuthenticated, onAuthOpen, onClose }) {
  const [expandedDropdown, setExpandedDropdown] = useState(null);
  const { data: normalCategories = [] } = useNormalCategoriesQuery();
  const { data: bajoPedidoCategories = [] } = useBajoPedidoCategoriesQuery();
  return /* @__PURE__ */ jsxs("div", { className: "border-t border-[--color-border] bg-[--color-surface] px-4 py-4 md:hidden max-h-[70vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1", children: NAV_LINKS.map((link) => {
      const active = isLinkActive(link.href, pathname, link.exact);
      if (link.dropdown) {
        const isExpanded = expandedDropdown === link.dropdownId;
        const categories = link.dropdownId === "perfumes" ? normalCategories.filter((c) => c.name.toLowerCase() !== "all") : bajoPedidoCategories.filter((c) => c.name.toLowerCase() !== "all");
        const basePath = link.dropdownId === "perfumes" ? "/catalogo/perfumes" : "/bajo-pedido";
        return /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setExpandedDropdown(isExpanded ? null : link.dropdownId),
              className: [
                "flex w-full items-center justify-between rounded-lg px-3 py-2.5 font-heading text-sm transition-colors",
                active || isExpanded ? "bg-accent text-bg" : "text-white hover:text-accent"
              ].join(" "),
              children: [
                link.label,
                /* @__PURE__ */ jsx(
                  "svg",
                  {
                    width: "10",
                    height: "10",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2.5",
                    className: `transition-transform ${isExpanded ? "rotate-180" : ""}`,
                    children: /* @__PURE__ */ jsx("polyline", { points: "6 9 12 15 18 9" })
                  }
                )
              ]
            }
          ),
          isExpanded && /* @__PURE__ */ jsxs("div", { className: "ml-3 mt-1 flex flex-col gap-0.5 border-l-2 border-accent/30 pl-3", children: [
            /* @__PURE__ */ jsx(
              "a",
              {
                href: basePath,
                onClick: onClose,
                className: "rounded-md px-3 py-2 text-sm font-semibold text-accent",
                children: "Ver Todos"
              }
            ),
            categories.map((cat) => /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "block px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white/60", children: cat.name }),
              cat.marcas.map((sub) => /* @__PURE__ */ jsxs(
                "a",
                {
                  href: `${basePath}?category=${cat.id}&marca=${sub.id}`,
                  onClick: onClose,
                  className: "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-white/80 hover:text-accent transition-colors",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "w-1 h-1 rounded-full bg-accent/50 shrink-0" }),
                    sub.name
                  ]
                },
                sub.id
              ))
            ] }, cat.id))
          ] })
        ] }, link.label);
      }
      return /* @__PURE__ */ jsx(
        "a",
        {
          href: link.href,
          onClick: onClose,
          className: [
            "flex items-center gap-2 rounded-lg px-3 py-2.5 font-heading text-sm transition-colors",
            active ? "bg-accent text-bg" : "text-white hover:text-accent"
          ].join(" "),
          children: link.label
        },
        link.label
      );
    }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-3 border-t border-[--color-border] pt-3", children: isAuthenticated ? /* @__PURE__ */ jsx("a", { href: "/mi-cuenta", className: "block font-heading text-xs uppercase tracking-wider text-[--color-accent]", children: "Mi cuenta" }) : /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => {
          onAuthOpen();
          onClose();
        },
        className: "font-heading text-xs uppercase tracking-wider text-[--color-accent]",
        children: "Ingresar"
      }
    ) })
  ] });
}

function Navbar() {
  const {
    itemCount,
    setDrawerOpen,
    isAuthenticated,
    authOpen,
    setAuthOpen,
    mobileOpen,
    setMobileOpen,
    openDropdown,
    setOpenDropdown,
    activeCategory,
    setActiveCategory,
    dropdownRef,
    pathname,
    isScrolled,
    handleDropdownEnter,
    handleDropdownLeave,
    handleDropdownContentEnter,
    handleDropdownContentLeave
  } = useNavbarHook();
  const isLightTheme = pathname === "/" && !isScrolled;
  const iconColor = isLightTheme ? "#E5E7EB" : "#CCB377";
  return /* @__PURE__ */ jsxs(AppProviders, { withToaster: true, children: [
    /* @__PURE__ */ jsxs(
      "header",
      {
        className: `sticky top-0 z-40 transition-all duration-300 ${isLightTheme ? "bg-transparent" : "bg-[--color-bg]/95 backdrop-blur-md shadow-sm border-b border-white/5"}`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 sm:gap-6 px-4 sm:px-6", children: [
            /* @__PURE__ */ jsx("a", { href: "/", className: "shrink-0", "aria-label": "NönDecants — Inicio", children: /* @__PURE__ */ jsx(
              LogoIconSvg,
              {
                width: 200,
                height: 32,
                color: isLightTheme ? "white" : "#CCB377"
              }
            ) }),
            /* @__PURE__ */ jsx(
              "nav",
              {
                className: "hidden md:flex items-center gap-0.5 rounded-full bg-surface-raised px-1.5 py-1.5",
                "aria-label": "Navegación principal",
                children: NAV_LINKS.map((link) => {
                  const active = isLinkActive(link.href, pathname, link.exact);
                  if (link.dropdown) {
                    const isOpen = openDropdown === link.dropdownId;
                    return /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "relative",
                        onMouseEnter: () => handleDropdownEnter(link.dropdownId),
                        onMouseLeave: handleDropdownLeave,
                        children: /* @__PURE__ */ jsxs(
                          "button",
                          {
                            className: [
                              "flex items-center gap-1 rounded-full px-4 py-1.5 font-heading text-sm font-medium transition-colors",
                              active || isOpen ? "bg-accent text-bg" : "text-white hover:text-accent"
                            ].join(" "),
                            children: [
                              link.label,
                              /* @__PURE__ */ jsx(
                                "svg",
                                {
                                  width: "10",
                                  height: "10",
                                  viewBox: "0 0 24 24",
                                  fill: "none",
                                  stroke: "currentColor",
                                  strokeWidth: "2.5",
                                  className: `transition-transform ${isOpen ? "rotate-180" : ""}`,
                                  children: /* @__PURE__ */ jsx("polyline", { points: "6 9 12 15 18 9" })
                                }
                              )
                            ]
                          }
                        )
                      },
                      link.label
                    );
                  }
                  return /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: link.href,
                      onClick: () => setOpenDropdown(null),
                      className: [
                        "flex items-center gap-1 rounded-full px-4 py-1.5 font-heading text-sm font-medium transition-colors",
                        active && !openDropdown ? "bg-accent text-bg" : "text-white hover:text-accent"
                      ].join(" "),
                      children: link.label
                    },
                    link.label
                  );
                })
              }
            ),
            openDropdown === "perfumes" && /* @__PURE__ */ jsx(
              PerfumesMenuDropdown,
              {
                activeCategory,
                setActiveCategory,
                onClose: () => setOpenDropdown(null),
                dropdownRef,
                onMouseEnter: handleDropdownContentEnter,
                onMouseLeave: handleDropdownContentLeave
              }
            ),
            openDropdown === "bajoPedido" && /* @__PURE__ */ jsx(
              PerfumeDropdown,
              {
                activeCategory,
                setActiveCategory,
                onClose: () => setOpenDropdown(null),
                dropdownRef,
                onMouseEnter: handleDropdownContentEnter,
                onMouseLeave: handleDropdownContentLeave
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-0.5", children: [
              isAuthenticated ? /* @__PURE__ */ jsx(
                "a",
                {
                  href: "/mi-cuenta",
                  className: "hidden md:flex p-2.5 transition-colors hover:opacity-80",
                  style: { color: iconColor },
                  "aria-label": "Mi cuenta",
                  children: /* @__PURE__ */ jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: [
                    /* @__PURE__ */ jsx("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
                    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "7", r: "4" })
                  ] })
                }
              ) : /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setAuthOpen(true),
                  className: "hidden md:flex p-2.5 transition-colors hover:opacity-80",
                  style: { color: iconColor },
                  "aria-label": "Ingresar",
                  children: /* @__PURE__ */ jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: [
                    /* @__PURE__ */ jsx("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
                    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "7", r: "4" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setDrawerOpen(true),
                  className: "relative p-2.5 transition-colors hover:opacity-80",
                  style: { color: iconColor },
                  "aria-label": "Carrito",
                  children: [
                    /* @__PURE__ */ jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: [
                      /* @__PURE__ */ jsx("path", { d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" }),
                      /* @__PURE__ */ jsx("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
                      /* @__PURE__ */ jsx("path", { d: "M16 10a4 4 0 0 1-8 0" })
                    ] }),
                    itemCount > 0 && /* @__PURE__ */ jsx("span", { className: "absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold font-bold text-xs text-brand-black", children: itemCount > 9 ? "9+" : itemCount })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "p-2.5 transition-colors hover:opacity-80 md:hidden",
                  style: { color: iconColor },
                  onClick: () => setMobileOpen((o) => !o),
                  "aria-label": "Menú",
                  children: /* @__PURE__ */ jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: mobileOpen ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                    /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
                    /* @__PURE__ */ jsx("line", { x1: "3", y1: "12", x2: "21", y2: "12" }),
                    /* @__PURE__ */ jsx("line", { x1: "3", y1: "18", x2: "21", y2: "18" })
                  ] }) })
                }
              )
            ] })
          ] }),
          mobileOpen && /* @__PURE__ */ jsx(
            MobileMenu,
            {
              pathname,
              isAuthenticated,
              onAuthOpen: () => setAuthOpen(true),
              onClose: () => setMobileOpen(false)
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx(CartDrawerIsland, {}),
    /* @__PURE__ */ jsx(AuthModalIsland, { open: authOpen, onClose: () => setAuthOpen(false) })
  ] });
}

const $$Astro$1 = createAstro();
const $$FooterLink = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$FooterLink;
  const { href, label } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<li> <a${addAttribute(href, "href")} class="text-sm text-[--color-text-muted] hover:text-[--color-accent] transition-colors"> ${label} </a> </li>`;
}, "C:/Users/Jaely/Documents/Nondecansts/nondecants-front/src/app/features/landing/components/FooterLink.astro", void 0);

const payPhoneSvg = new Proxy({"src":"/_astro/payPhone.DZWDaDpR.svg","width":174,"height":62,"format":"svg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Jaely/Documents/Nondecansts/nondecants-front/src/assets/svg/payPhone.svg";
							}
							
							return target[name];
						}
					});

const visaSvg = new Proxy({"src":"/_astro/visa.Cpu7rP4n.svg","width":70,"height":48,"format":"svg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Jaely/Documents/Nondecansts/nondecants-front/src/assets/svg/visa.svg";
							}
							
							return target[name];
						}
					});

const discoverSvg = new Proxy({"src":"/_astro/discover.rkAK_2Ge.svg","width":70,"height":48,"format":"svg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Jaely/Documents/Nondecansts/nondecants-front/src/assets/svg/discover.svg";
							}
							
							return target[name];
						}
					});

const amexSvg = new Proxy({"src":"/_astro/amex.CmW2ALX0.svg","width":70,"height":48,"format":"svg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Jaely/Documents/Nondecansts/nondecants-front/src/assets/svg/amex.svg";
							}
							
							return target[name];
						}
					});

const dinnersSvg = new Proxy({"src":"/_astro/dinners.CW2LEGwH.svg","width":70,"height":48,"format":"svg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Jaely/Documents/Nondecansts/nondecants-front/src/assets/svg/dinners.svg";
							}
							
							return target[name];
						}
					});

const faceSvg = new Proxy({"src":"/_astro/face.BnG2wH1P.svg","width":56,"height":54,"format":"svg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Jaely/Documents/Nondecansts/nondecants-front/src/assets/svg/face.svg";
							}
							
							return target[name];
						}
					});

const instaSvg = new Proxy({"src":"/_astro/insta.DP8kbPlA.svg","width":57,"height":58,"format":"svg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Jaely/Documents/Nondecansts/nondecants-front/src/assets/svg/insta.svg";
							}
							
							return target[name];
						}
					});

const ticktockSvg = new Proxy({"src":"/_astro/ticktock.s1PTBIVT.svg","width":60,"height":60,"format":"svg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Jaely/Documents/Nondecansts/nondecants-front/src/assets/svg/ticktock.svg";
							}
							
							return target[name];
						}
					});

const IMG = {
  p1: "/home-5.png",
  p2: "/home-6.png",
  p3: "/yara.png",
  p4: "/img-9.png",
  p5: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=480&h=580&fit=crop&q=80",
  p6: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=480&h=580&fit=crop&q=80",
  p7: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=480&h=580&fit=crop&q=80",
  p8: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=480&h=580&fit=crop&q=80",
  p9: "/home-4.png",
  p10: "/home-3.png",
  p11: "/home-2.png",
  p12: "/home-1.png",
  b1: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&h=560&fit=crop&q=80",
  b2: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1400&h=560&fit=crop&q=80",
  b3: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1400&h=560&fit=crop&q=80"
};
const MOCK_BANNERS = [
  {
    id: "b1",
    title: "Única Experiencia",
    subtitle: "Decants & Sellados — Envíos a todo Ecuador",
    image: IMG.b1,
    link: "/catalogo",
    isActive: true,
    order: 1
  },
  {
    id: "b2",
    title: "Fragancias Exclusivas",
    subtitle: "Las mejores marcas, en el tamaño que quieres",
    image: IMG.b2,
    link: "/catalogo",
    isActive: true,
    order: 2
  },
  {
    id: "b3",
    title: "Nueva Colección",
    subtitle: "Últimos ingresos disponibles ahora",
    image: IMG.b3,
    link: "/catalogo",
    isActive: true,
    order: 3
  }
];
const MOCK_PRODUCTS = [
  {
    id: "p1",
    name: "Le Male",
    description: "Icónica fragancia masculina con notas de lavanda, menta y vainilla. Un clásico atemporal.",
    image: IMG.p1,
    images: [IMG.p1, IMG.p2],
    variants: [
      { id: "p1-v1", ml: 125, price: 89, mlSize: 125, isFullBottle: true, availableQuantity: 5 },
      { id: "p1-v2", ml: 75, price: 65, mlSize: 75, isFullBottle: true, availableQuantity: 3 }
    ],
    totalMl: 125,
    openBottleMlRemaining: 0,
    availableMl: 0,
    isActive: true,
    createdAt: "2026-02-01T00:00:00Z"
  },
  {
    id: "p2",
    name: "Stronger With You",
    description: "Fragancia cálida y sensual con notas de castaña, salvia y vainilla.",
    image: IMG.p2,
    images: [IMG.p2],
    variants: [
      { id: "p2-v1", ml: 100, price: 95, mlSize: 100, isFullBottle: true, availableQuantity: 4 },
      { id: "p2-v2", ml: 50, price: 65, mlSize: 50, isFullBottle: true, availableQuantity: 8 }
    ],
    totalMl: 100,
    openBottleMlRemaining: 0,
    availableMl: 0,
    isActive: true,
    createdAt: "2026-02-05T00:00:00Z"
  },
  {
    id: "p3",
    name: "Sauvage EDP",
    description: "Poderoso y noble, Sauvage evoca cielos abiertos y naturaleza salvaje.",
    image: IMG.p3,
    images: [IMG.p3],
    variants: [
      { id: "p3-v1", ml: 100, price: 145, mlSize: 100, isFullBottle: true, availableQuantity: 2 },
      { id: "p3-v2", ml: 60, price: 98, mlSize: 60, isFullBottle: true, availableQuantity: 6 }
    ],
    totalMl: 100,
    openBottleMlRemaining: 0,
    availableMl: 0,
    isActive: true,
    createdAt: "2026-02-10T00:00:00Z"
  },
  {
    id: "p4",
    name: "Bleu de Chanel EDP",
    description: "La expresión de una libertad que desafía las convenciones. Madera cedro y sándalo.",
    image: IMG.p4,
    images: [IMG.p4],
    variants: [
      { id: "p4-v1", ml: 10, price: 22, mlSize: 10, isFullBottle: false, availableQuantity: 15 },
      { id: "p4-v2", ml: 20, price: 38, mlSize: 20, isFullBottle: false, availableQuantity: 10 },
      { id: "p4-v3", ml: 30, price: 52, mlSize: 30, isFullBottle: false, availableQuantity: 7 }
    ],
    totalMl: 100,
    openBottleMlRemaining: 80,
    availableMl: 80,
    isActive: true,
    createdAt: "2026-02-12T00:00:00Z"
  },
  {
    id: "p5",
    name: "Spicebomb Extreme",
    description: "Una bomba de especias con vainilla y tabaco. Proyección excepcional.",
    image: IMG.p5,
    images: [IMG.p5],
    variants: [
      { id: "p5-v1", ml: 5, price: 12, mlSize: 5, isFullBottle: false, availableQuantity: 20 },
      { id: "p5-v2", ml: 10, price: 21, mlSize: 10, isFullBottle: false, availableQuantity: 14 },
      { id: "p5-v3", ml: 20, price: 38, mlSize: 20, isFullBottle: false, availableQuantity: 8 }
    ],
    totalMl: 100,
    openBottleMlRemaining: 60,
    availableMl: 60,
    isActive: true,
    createdAt: "2026-02-15T00:00:00Z"
  },
  {
    id: "p6",
    name: "Noir EDP",
    description: "Oriental sofisticado con bergamota, cardamomo y ámbar gris. Lujo absoluto.",
    image: IMG.p6,
    images: [IMG.p6],
    variants: [
      { id: "p6-v1", ml: 5, price: 18, mlSize: 5, isFullBottle: false, availableQuantity: 12 },
      { id: "p6-v2", ml: 10, price: 32, mlSize: 10, isFullBottle: false, availableQuantity: 7 }
    ],
    totalMl: 100,
    openBottleMlRemaining: 50,
    availableMl: 50,
    isActive: true,
    createdAt: "2026-02-18T00:00:00Z"
  },
  {
    id: "p7",
    name: "Perfume Árabe Lattafa",
    description: "Fragancia oriental de alta proyección con notas de oud, rosa y almizcle.",
    image: IMG.p7,
    images: [IMG.p7],
    variants: [
      { id: "p7-v1", ml: 100, price: 42, mlSize: 100, isFullBottle: true, availableQuantity: 9 }
    ],
    totalMl: 100,
    openBottleMlRemaining: 0,
    availableMl: 0,
    isActive: true,
    createdAt: "2026-02-20T00:00:00Z"
  },
  {
    id: "p8",
    name: "9pm Rebel",
    description: "Fragancia nocturna intensa. Madera oscura, vainilla y almizcle blanco.",
    image: IMG.p8,
    images: [IMG.p8],
    variants: [
      { id: "p8-v1", ml: 100, price: 38, mlSize: 100, isFullBottle: true, availableQuantity: 11 },
      { id: "p8-v2", ml: 50, price: 24, mlSize: 50, isFullBottle: true, availableQuantity: 6 }
    ],
    totalMl: 100,
    openBottleMlRemaining: 0,
    availableMl: 0,
    isActive: true,
    createdAt: "2026-02-22T00:00:00Z"
  },
  {
    id: "p9",
    name: "Perfume Valentino",
    description: "La profundidad del océano en una fragancia. Acuático, marino y mineral.",
    image: IMG.p9,
    images: [IMG.p9],
    variants: [
      { id: "p9-v1", ml: 75, price: 98, mlSize: 75, isFullBottle: true, availableQuantity: 4 }
    ],
    totalMl: 75,
    openBottleMlRemaining: 0,
    availableMl: 0,
    isActive: true,
    createdAt: "2026-02-25T00:00:00Z"
  },
  {
    id: "p10",
    name: "Bourbon EDP",
    description: "El hombre Valentino. Bergamota italiana, iris y cedro de Virginia.",
    image: IMG.p10,
    images: [IMG.p10],
    variants: [
      { id: "p10-v1", ml: 5, price: 14, mlSize: 5, isFullBottle: false, availableQuantity: 18 },
      { id: "p10-v2", ml: 10, price: 24, mlSize: 10, isFullBottle: false, availableQuantity: 10 },
      { id: "p10-v3", ml: 30, price: 58, mlSize: 30, isFullBottle: false, availableQuantity: 3 }
    ],
    totalMl: 100,
    openBottleMlRemaining: 70,
    availableMl: 70,
    isActive: true,
    createdAt: "2026-02-26T00:00:00Z"
  },
  {
    id: "p11",
    name: "Lataffa H&G",
    description: "Seductor y sensual. Cardamomo, madera cedro y vetiver. Perfecto para la noche.",
    image: IMG.p11,
    images: [IMG.p11],
    variants: [
      { id: "p11-v1", ml: 10, price: 19, mlSize: 10, isFullBottle: false, availableQuantity: 22 },
      { id: "p11-v2", ml: 20, price: 34, mlSize: 20, isFullBottle: false, availableQuantity: 15 }
    ],
    totalMl: 100,
    openBottleMlRemaining: 80,
    availableMl: 80,
    isActive: true,
    createdAt: "2026-02-27T00:00:00Z"
  },
  {
    id: "p12",
    name: "Perfume Arabe",
    description: "Fragancia oriental amaderada con notas de bourbon, cuero y especias.",
    image: IMG.p12,
    images: [IMG.p12],
    variants: [
      { id: "p12-v1", ml: 100, price: 35, mlSize: 100, isFullBottle: true, availableQuantity: 14 }
    ],
    totalMl: 100,
    openBottleMlRemaining: 0,
    availableMl: 0,
    isActive: true,
    createdAt: "2026-02-28T00:00:00Z"
  }
];
const TESTIMONIALS = [
  {
    badge: "COMPRADOR FRECUENTE",
    name: "MARIANO TORRES",
    text: "Excepturi praesentium beatae ut nemo commodi. Nemo omnis repudiandae culpa quaerat soluta dolorem aspernatur et. Repellendus sint reprehenderit dignissimos consequatur maiores.",
    rating: 5,
    avatar: "/avatar.png",
    productImage: "/home-3.png"
  },
  {
    badge: "CLIENTE NUEVO",
    name: "ANDREA VILLACÍS",
    text: "Increíble calidad en cada decant. Los aromas son exactamente como los originales y el servicio fue rápido y profesional. Definitivamente volvería a comprar.",
    rating: 5,
    avatar: "/avatar.png",
    productImage: "/home-1.png"
  },
  {
    badge: "CLIENTE FRECUENTE",
    name: "CARLOS MENDOZA",
    text: "La variedad de fragancias es impresionante. Pude probar varios decants antes de decidirme. El packaging es excelente y la entrega fue en tiempo récord.",
    rating: 5,
    avatar: "/avatar.png",
    productImage: "/home-4.png"
  }
];
const FOOTER_LINKS_COL1 = [
  { href: "/catalogo", label: "Perfumes" },
  { href: "/catalogo", label: "Sellados" },
  { href: "/catalogo", label: "Decants" },
  { href: "/catalogo", label: "Nondecants" },
  { href: "/catalogo", label: "Combos" }
];
const FOOTER_LINKS_COL2 = [
  { href: "#", label: "Acerca de" },
  { href: "#", label: "Sucursales" },
  { href: "#", label: "Blog" },
  { href: "#", label: "Bajo pedido" },
  { href: "#", label: "FAQ" }
];

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const SOCIAL_ICONS = [
    { src: faceSvg.src, alt: "Facebook", href: "#" },
    { src: instaSvg.src, alt: "Instagram", href: "#" },
    { src: ticktockSvg.src, alt: "TikTok", href: "#" }
  ];
  const PAYMENT_ICONS = [
    { src: payPhoneSvg.src, alt: "PayPhone" },
    { src: visaSvg.src, alt: "Visa" },
    { src: dinnersSvg.src, alt: "Diners Club" },
    { src: amexSvg.src, alt: "American Express" },
    { src: discoverSvg.src, alt: "Discover" }
  ];
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return renderTemplate`${maybeRenderHead()}<footer class="bg-[url('/footer.png')] bg-cover bg-center bg-no-repeat border-t border-border relative"> <div class="absolute inset-0 bg-black/70"></div> <div class="max-w-7xl mx-auto px-6 py-12 relative z-10"> <div class="grid grid-cols-1 md:grid-cols-4 gap-8"> <!-- Columna marca --> <div class="md:col-span-1"> <a href="/" aria-label="NönDecants — Inicio"> <img${addAttribute(logoSvg.src, "src")} alt="NönDecants" class="w-40 h-auto"> </a> <p class="text-[--color-text-muted] text-lg leading-relaxed mt-2 max-w-xs">
Plataforma especializada en la venta de perfumes sellados, decants y nondecants en Ecuador.
          Cada fragancia, en el tamaño que necesitas.
</p> <!-- Social --> <div class="flex items-center gap-4 mt-6"> ${SOCIAL_ICONS.map((s) => renderTemplate`<a${addAttribute(s.href, "href")}${addAttribute(s.alt, "aria-label")} class="hover:opacity-80 transition-opacity"> <img${addAttribute(s.src, "src")}${addAttribute(s.alt, "alt")} class="w-7 h-7"> </a>`)} </div> </div> <!-- Links col 1 --> <div> <p class="font-heading text-lg uppercase tracking-[0.2em] text-[--color-text] mb-4">
Links
</p> <ul class="space-y-2"> ${FOOTER_LINKS_COL1.map((l) => renderTemplate`${renderComponent($$result, "FooterLink", $$FooterLink, { "href": l.href, "label": l.label })}`)} </ul> </div> <!-- Links col 2 --> <div> <p class="font-heading text-lg uppercase tracking-[0.2em] text-[--color-text] mb-4">
Links
</p> <ul class="space-y-2"> ${FOOTER_LINKS_COL2.map((l) => renderTemplate`${renderComponent($$result, "FooterLink", $$FooterLink, { "href": l.href, "label": l.label })}`)} </ul> </div> <!-- Contacto --> <div> <p class="font-heading text-lg uppercase tracking-[0.2em] text-[--color-text] mb-4">
Contacto
</p> <ul class="space-y-2 text-lg text-[--color-text-muted]"> <li class="flex items-start gap-2"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mt-0.5 shrink-0 text-[--color-accent]"> <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.18 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path> </svg>
+593 99 000 0000
</li> <li class="flex items-start gap-2"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mt-0.5 shrink-0 text-[--color-accent]"> <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path> <polyline points="22,6 12,13 2,6"></polyline> </svg>
contacto@nondecants.ec
</li> <li class="flex items-start gap-2"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mt-0.5 shrink-0 text-[--color-accent]"> <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path> <circle cx="12" cy="10" r="3"></circle> </svg>
Daule, Ecuador
</li> </ul> </div> </div> </div> <!-- Bottom bar --> <div class="max-w-7xl mx-auto px-6 relative z-10"> <div class="border-t border-[--color-border]"></div> <div class="py-6 flex flex-col sm:flex-row items-center justify-between gap-3"> <p class="text-lg text-[--color-text-muted]">
© ${year} NönDecants. All rights reserved. Made by Shopwishi.
</p> <!-- Payment badges --> <div class="flex items-center gap-2"> ${PAYMENT_ICONS.map((icon) => renderTemplate`<img${addAttribute(icon.src, "src")}${addAttribute(icon.alt, "alt")} class="h-8 w-auto">`)} </div> </div> </div> </footer>`;
}, "C:/Users/Jaely/Documents/Nondecansts/nondecants-front/src/app/features/landing/components/layout/Footer.astro", void 0);

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Por favor ingresa un correo electrónico válido.");
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post(API_ENDPOINTS.NEWSLETTER_SUBSCRIBE, { email });
      setSubmitted(true);
      toast.success("¡Te has suscrito exitosamente!");
    } catch (error) {
      const message = error.response?.data?.message || "Error al suscribirse. Intenta de nuevo.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("section", { className: "w-full bg-white py-16", children: /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden mx-auto", children: [
    /* @__PURE__ */ jsx(
      "img",
      {
        src: "/img-subs.png",
        alt: "",
        className: "w-full h-96 sm:h-[400px] lg:h-[450px] object-cover",
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/40" }),
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-10 mx-auto w-full max-w-8xl px-4 lg:px-28 flex flex-col justify-center gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start gap-4", children: [
        /* @__PURE__ */ jsx(LogoIconSvg, { width: 420, height: 66 }),
        /* @__PURE__ */ jsxs("svg", { width: "420", height: "4", viewBox: "0 0 420 4", fill: "none", children: [
          /* @__PURE__ */ jsx("line", { x1: "0", y1: "2", x2: "416", y2: "2", stroke: "white", strokeWidth: "1.5" }),
          /* @__PURE__ */ jsx("polygon", { points: "416,0 420,2 416,4", fill: "white" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-center w-full", children: submitted ? /* @__PURE__ */ jsx("p", { className: "text-white font-heading uppercase tracking-wider text-lg", children: "¡Gracias! Te avisaremos con las novedades." }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col sm:flex-row items-center gap-4 lg:gap-6 w-full max-w-3xl", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            placeholder: "Tu correo electrónico",
            required: true,
            disabled: loading,
            className: "flex-1 w-full px-6 py-4 bg-white text-bg placeholder:text-text-muted text-base md:text-lg focus:outline-none rounded-md"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: loading,
            className: "px-8 py-4 bg-black text-white font-heading text-sm md:text-base uppercase tracking-widest hover:bg-black/80 transition-colors shrink-0 whitespace-nowrap rounded-md disabled:opacity-60 disabled:cursor-not-allowed",
            children: loading ? "Enviando..." : "Suscribirme a NonDecants"
          }
        )
      ] }) })
    ] })
  ] }) });
}

const $$Astro = createAstro();
const $$PublicLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PublicLayout;
  const { title, description } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title, "description": description }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "AnnouncementBar", $$AnnouncementBar, {})} ${renderComponent($$result2, "Navbar", Navbar, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/app/features/landing/components/layout/Navbar", "client:component-export": "default" })} ${maybeRenderHead()}<main> ${renderSlot($$result2, $$slots["default"])} </main> ${renderComponent($$result2, "NewsletterSection", NewsletterSection, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "@/app/features/landing/components/sections-home/NewsletterSection", "client:component-export": "default" })} ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "C:/Users/Jaely/Documents/Nondecansts/nondecants-front/src/layouts/PublicLayout.astro", void 0);

export { $$PublicLayout as $, AuthModal as A, MOCK_BANNERS as M, TESTIMONIALS as T, authService as a, MOCK_PRODUCTS as b, useCategoriesWithMarcasQuery as u };
