export function Wave({ className, fill }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 320"
    >
      <path
        fill={fill || "#f3f8fc"}
        fillOpacity="1"
        d="M0,192L17.1,197.3C34.3,203,69,213,103,234.7C137.1,256,171,288,206,266.7C240,245,274,171,309,133.3C342.9,96,377,96,411,106.7C445.7,117,480,139,514,122.7C548.6,107,583,53,617,74.7C651.4,96,686,192,720,240C754.3,288,789,288,823,250.7C857.1,213,891,139,926,128C960,117,994,171,1029,181.3C1062.9,192,1097,160,1131,128C1165.7,96,1200,64,1234,90.7C1268.6,117,1303,203,1337,218.7C1371.4,235,1406,181,1423,154.7L1440,128L1440,0L1422.9,0C1405.7,0,1371,0,1337,0C1302.9,0,1269,0,1234,0C1200,0,1166,0,1131,0C1097.1,0,1063,0,1029,0C994.3,0,960,0,926,0C891.4,0,857,0,823,0C788.6,0,754,0,720,0C685.7,0,651,0,617,0C582.9,0,549,0,514,0C480,0,446,0,411,0C377.1,0,343,0,309,0C274.3,0,240,0,206,0C171.4,0,137,0,103,0C68.6,0,34,0,17,0L0,0Z"
      ></path>
    </svg>
  );
}