import { GetServerSideProps } from "next";

const Page = ({ data }: any) => {
  const people = data.data.guillotine.getChildren.map((p) => p.displayName);
  return (
    <div>
      <ul>
        {people.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = `
    {
      guillotine {
        getChildren(key: "\${site}/persons", first: 7) {
          displayName
          _path
        }
      }
    }
  `;

  const url = "http://localhost:8080/site/hmdb/draft/hmdb/api";

  const data = await fetch(url, {
    method: "post",
    body: JSON.stringify({ query, variables: null }),
  }).then((res: any) => res.json());

  console.log(JSON.stringify(data));

  return {
    props: {
      data,
    },
  };
};
export default Page;
