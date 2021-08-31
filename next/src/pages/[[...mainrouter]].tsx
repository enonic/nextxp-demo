// this type is purposefully naive. Please make sure to update this with a more
// accurate model before using it.
type Context = {
  params: { mainrouter: string[] };
};

// this function also needs some serious refactoring, but for a quick and dirty
// proof of concept it does the job.
export const getServerSideProps = async ( { params }: Context) => {
  const path = "/" + params.mainrouter.join("/");

  const fallback = { displayName: "N/A", _path: "None" };
  const content = path
    ? await fetchContent(path).catch((err) => {
        console.error(err);
        return fallback;
      })
    : fallback;

  return {
    props: {
      content,
    },
  };
};

export default Element;
