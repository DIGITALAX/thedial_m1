import Image from "next/legacy/image";
import { FormEvent, FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import InfiniteScroll from "react-infinite-scroll-component";
import { INFURA_GATEWAY } from "../../../../lib/lens/constants";
import { TurnerProps } from "./../types/scan.types";
import { TfiSearch } from "react-icons/tfi";

const Turner: FunctionComponent<TurnerProps> = ({
  currentSetting,
  handleCount,
  canvasURIs,
  handleQuickSearch,
  publicationSearchLength,
  profileSearchValues,
  handleMoreProfileQuickSearch,
  searchLoading,
  dropDown,
  handleChosenSearch,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit col-start-1 row-start-2 md:row-start-1 md:col-start-2 grid grid-flow-row auto-rows-auto self-center sm:self-start md:self-center justify-center md:justify-end gap-10 pr-10 pt-8 sm:pt-16 top-24 lg:top-0 lg:pt-0">
      <div
        className="relative w-fit h-fit row-start-1 hover:rotate-3 active:rotate-6"
        onClick={() => handleCount(currentSetting)}
      >
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmQZ8UwjeizDQkbCiZED8Ya4LxpFD5JbVbNeAdowurHkiY`}
          className="relative w-fit h-fit relative cursor-pointer"
          width={230}
          height={230}
          alt="dial"
        />
      </div>
      <div className="relative w-full h-fit row-start-2 grid grid-flow-col auto-cols-auto">
        <div className="relative w-full h-10 col-start-1 row-start-1 grid grid-flow-col auto-cols-auto rounded-lg border-2 border-white opacity-90 gap-3 pl-1 bg-bluey/30">
          <div className="relative col-start-1 w-fit h-fit place-self-center place-self-center grid grid-flow-col auto-cols-auto pl-2">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmZhr4Eo92GHQ3Qn3xpv8HSz7ArcjgSPsD3Upe9v8H5rge`}
              alt="search"
              width={15}
              height={20}
              className="flex w-fit h-fit relative col-start-1 place-self-center"
            />
          </div>
          <div className="relative col-start-2 w-1 h-5/6 self-center justify-self-start border border-white rounded-lg"></div>
          <div className="relative w-full h-full grid grid-flow-row auto-rows-auto col-start-3">
            <input
              className="relative row-start-1 w-full h-full font-dosis pl-2 text-white rounded-lg bg-transparent caret-transparent"
              name="search"
              placeholder="search"
              onChange={(e: FormEvent) => handleQuickSearch(e)}
            />
          </div>
        </div>
        <div className="absolute w-full h-full grid grid-flow-row auto-rows-auto col-start-1 row-start-2 col-span-1">
          {
            <div
              className={`relative grid grid-flow-row auto-rows-auto w-full h-fit overflow-y-scroll z-10`}
            >
              {searchLoading ? (
                <div className="relative w-full h-10 px-3 py-2 col-start-1 grid grid-flow-col auto-cols-auto bg-bluey/30">
                  <div className="relative w-fit h-fit place-self-center animate-spin col-start-1">
                    <AiOutlineLoading color="white" size={15} />
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-fit grid grid-flow-row auto-rows-auto">
                  {dropDown && publicationSearchLength > 0 && (
                    <div
                      className="rounded-md relative w-full h-fit px-3 py-2 col-start-1 grid grid-flow-col auto-cols-auto gap-3 cursor-pointer border-y border-white font-dosis hover:bg-offBlue row-start-1 text-white bg-bluey/30"
                      onClick={() => handleChosenSearch("pub")}
                    >
                      <div className="relative w-fit h-fit col-start-1 place-self-center">
                        <TfiSearch color="white" size={15} />
                      </div>
                      <div className="relative w-fit h-fit col-start-2 place-self-center">
                        {publicationSearchLength}
                      </div>
                      <div className="relative col-start-3 place-self-center">
                        On this Topic
                      </div>
                    </div>
                  )}
                  {profileSearchValues?.length > 0 && dropDown && (
                    <InfiniteScroll
                      hasMore={true}
                      dataLength={profileSearchValues?.length}
                      next={handleMoreProfileQuickSearch}
                      loader={""}
                      height={"10rem"}
                      className={`${
                        publicationSearchLength && publicationSearchLength > 0
                          ? "row-start-2"
                          : "row-start-1"
                      } relative w-full h-fit`}
                    >
                      {profileSearchValues?.map((user: any, index: number) => {
                        let profileImage: string;
                        if (!user?.picture?.original) {
                          profileImage = "";
                        } else if (user?.picture?.original) {
                          if (user?.picture?.original?.url.includes("http")) {
                            profileImage = user?.picture?.original.url;
                          } else {
                            const cut = user?.picture?.original?.url.split("/");
                            profileImage = `${INFURA_GATEWAY}/ipfs/${cut[2]}`;
                          }
                        } else {
                          profileImage = user?.picture?.uri;
                        }
                        return (
                          <div
                            key={index}
                            className={`rounded-md relative w-full h-fit px-3 py-2 col-start-1 grid grid-flow-col auto-cols-auto gap-3 cursor-pointer border-y border-white  hover:bg-offBlue bg-bluey/30`}
                            onClick={() => {
                              handleChosenSearch("profile", user);
                            }}
                          >
                            <div className="relative w-fit h-fit col-start-1 text-white font-dosis lowercase place-self-center grid grid-flow-col auto-cols-auto gap-2">
                              <div
                                className={`relative rounded-full flex bg-white w-5 h-5 place-self-center col-start-1`}
                                id="crt"
                              >
                                {profileImage !== "" && (
                                  <Image
                                    src={profileImage}
                                    objectFit="cover"
                                    alt="pfp"
                                    layout="fill"
                                    className="relative w-fit h-fit rounded-full self-center"
                                  />
                                )}
                              </div>
                              <div className="relative col-start-2 place-self-center w-fit h-fit text-sm">
                                @{user?.handle}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </InfiniteScroll>
                  )}
                </div>
              )}
            </div>
          }
        </div>
        <div className="relative w-10 h-full col-start-2 row-start-1">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${canvasURIs[currentSetting]}`}
            layout="fill"
            alt="canvas"
          />
        </div>
      </div>
    </div>
  );
};

export default Turner;
