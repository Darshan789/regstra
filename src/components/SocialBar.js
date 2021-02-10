import React, { Component } from "react";
import Image from "react-bootstrap/Image";

class SocialBar extends Component {
  render() {
    return (
      <div className="social pos-bottom-bar">
        <div className="social-content p-0">
          <div className="grid-fixed-auto relative">
            <aside className="panel article-min">
              <div className="article-min-cont">
                <Image src="../images/user1.jpeg" className="avatar" />
                <p className="">
                  What types of documents do museums ask for from donors and
                  dealers in addition to provenance and history?
                </p>
              </div>
              <div className="events hide">
                <h3>Upcoming events near you</h3>
                <ul className="txt-s">
                  <li className="flex-row-sb">
                    <Image src="../images/venue1.jpeg" className="mr-12" />
                    <div className="w-100pc">
                      <h4 className="m-0">
                        ARTS & LETTERS LIVE: LOU BERNEY...
                      </h4>
                      <p className="m-0">Dallas Museum of Art</p>
                      <time>10/07/2018</time>
                    </div>
                  </li>
                  <li className="flex-row-sb">
                    <Image src="../images/venue2.jpeg" className="mr-12" />
                    <div className="w-100pc">
                      <h4 className="m-0">THE BREMEN TOWN MUSICIANS</h4>
                      <p className="m-0">Winspear Opera House - AT&T, Per…</p>
                      <time>10/06/2018 - 03/16/2019</time>
                    </div>
                  </li>
                  <li className="flex-row-sb">
                    <Image src="../images/venue3.jpeg" className="mr-12" />
                    <div className="w-100pc">
                      <h4 className="m-0">DANCEAFRICA</h4>
                      <p className="m-0">Moody Performance Hall</p>
                      <time>10/05/2018 - 10/06/2018</time>
                    </div>
                  </li>
                  <li className="flex-row-sb">
                    <Image src="../images/venue4.jpeg" className="mr-12" />
                    <div className="w-100pc">
                      <h4 className="m-0">FIRST SONG: CHILDREN’S CHORUS...</h4>
                      <p className="m-0">Moody Performance Hall</p>
                      <time>09/30/2018</time>
                    </div>
                  </li>
                  <li className="flex-row-sb">
                    <Image src="../images/venue1.jpeg" className="mr-12" />
                    <div className="w-100pc">
                      <h4 className="m-0">THE BREMEN TOWN MUSICIANS</h4>
                      <p className="m-0">Winspear Opera House - AT&T, Per…</p>
                      <time>10/06/2018 - 03/16/2019</time>
                    </div>
                  </li>
                  <li className="flex-row-sb">
                    <Image src="../images/venue1.jpeg" className="mr-12" />
                    <div className="w-100pc">
                      <h4 className="m-0">
                        ARTS & LETTERS LIVE: LOU BERNEY...
                      </h4>
                      <p className="m-0">Dallas Museum of Art</p>
                      <time>10/07/2018</time>
                    </div>
                  </li>
                  <li className="flex-row-sb">
                    <Image src="../images/venue2.jpeg" className="mr-12" />
                    <div className="w-100pc">
                      <h4 className="m-0">THE BREMEN TOWN MUSICIANS</h4>
                      <p className="m-0">Winspear Opera House - AT&T, Per…</p>
                      <time>10/06/2018 - 03/16/2019</time>
                    </div>
                  </li>
                  <li className="flex-row-sb">
                    <Image src="../images/venue3.jpeg" className="mr-12" />
                    <div className="w-100pc">
                      <h4 className="m-0">DANCEAFRICA</h4>
                      <p className="m-0">Moody Performance Hall</p>
                      <time>10/05/2018 - 10/06/2018</time>
                    </div>
                  </li>
                  <li className="flex-row-sb">
                    <Image src="../images/venue4.jpeg" className="mr-12" />
                    <div className="w-100pc">
                      <h4 className="m-0">FIRST SONG: CHILDREN’S CHORUS...</h4>
                      <p className="m-0">Moody Performance Hall</p>
                      <time>09/30/2018</time>
                    </div>
                  </li>
                  <li className="flex-row-sb">
                    <Image src="../images/venue1.jpeg" className="mr-12" />
                    <div className="w-100pc">
                      <h4 className="m-0">THE BREMEN TOWN MUSICIANS</h4>
                      <p className="m-0">Winspear Opera House - AT&T, Per…</p>
                      <time>10/06/2018 - 03/16/2019</time>
                    </div>
                  </li>
                </ul>
              </div>
            </aside>
            <section>
              <article className="panel panel-thin">
                <div className="flex-row-sb">
                  <div className="flex-row">
                    <Image src="../images/user6.jpg" className="avatar" />
                    <input
                      type="text"
                      name="post"
                      placeholder="Share an idea, article, thought..."
                    />
                  </div>
                  <button>post</button>
                </div>
              </article>
              <article className="panel">
                <div className="panel-head">
                  <a className="no-decor" href="#">
                    <div className="flex-row-sb">
                      <Image src="../images/user1.jpeg" className="avatar" />
                      <div>
                        <h3>Joan Cox</h3>
                        <p>Oil Painting Artist</p>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="panel-body grid-33-67">
                  <Image src="../images/articles/6.jpg" />
                  <div>
                    <div>
                      <h3>
                        What types of documents do museums ask for from donors
                        and dealers in addition to provenance and history?
                      </h3>
                      <p>
                        I think that some important overlooked documents in a
                        museum registrars toolbox would be documents related to
                        the objects. Aenean commodo ligula...
                      </p>
                    </div>
                    <div className="panel-footer">
                      <a href="#">Read More</a>
                      <div className="relative">
                        <div className="icon heart"></div>
                        <span className="hearts-number hide"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
              <article className="panel">
                <div className="panel-head">
                  <a href="#" className="no-decor">
                    <div className="flex-row-sb">
                      <Image src="../images/user4.jpeg" className="avatar" />
                      <div>
                        <h3>Leia Costa</h3>
                        <p>Painter</p>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="panel-body grid-33-67">
                  <Image src="../images/articles/5.jpg" />
                  <div>
                    <div>
                      <h3>Accountability in the Museum Industry</h3>
                      <p>
                        Provenance and authenticity of artworks are the primary
                        concerns of Regestra as forgeries and illegal sales are
                        an unfortunate byproduct of the art market et magnis dis
                        parturient montes, nascetur ridiculus Aenean commodo
                        ligula eget dolor. Aenean massa...
                      </p>
                    </div>
                    <div className="panel-footer">
                      <a href="#">Read More</a>
                      <div className="relative">
                        <div className="icon heart"></div>
                        <span className="hearts-number hide"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
              <article className="panel">
                <div className="panel-head">
                  <a href="#" className="no-decor">
                    <div className="flex-row-sb">
                      <Image src="../images/user3.jpeg" className="avatar" />
                      <div>
                        <h3>Arman Nixon</h3>
                        <p>Art Collector</p>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="panel-body grid-33-67">
                  <Image src="../images/articles/3.jpg" />
                  <div>
                    <div>
                      <h3>
                        Distributed Ledgers, Blockchain, and the Art Market
                      </h3>
                      <p>
                        A ledger is basically a trail. It generally exists in a
                        book or database of transactions in which separate
                        accounts can have their history summarized. In the
                        economic sense et magnis dis parturient montes, nascetur
                        ridiculus Aenean commodo ligula eget dolor. Aenean
                        massa...
                      </p>
                    </div>
                    <div className="panel-footer">
                      <a href="#">Read More</a>
                      <div className="relative">
                        <div className="icon heart"></div>
                        <span className="hearts-number hide"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
              <article className="panel">
                <div className="panel-head">
                  <a href="#" className="no-decor">
                    <div className="flex-row-sb">
                      <Image src="../images/user5.jpg" className="avatar" />
                      <div>
                        <h3>Asher Flowers</h3>
                        <p>Art Collector</p>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="panel-body grid-33-67">
                  <Image src="../images/articles/1.jpg" />
                  <div>
                    <div>
                      <h3>The Uneven Terrain of The Art Market</h3>
                      <p>
                        The art market is not an easy beast to follow, both to
                        those fluent in the market and especially to those
                        unfamiliar with the market. With an industry value of
                        fifty billion. In the economic sense et magnis dis
                        parturient montes, nascetur ridiculus Aenean commodo
                        ligula eget dolor. Aenean massa...
                      </p>
                    </div>
                    <div className="panel-footer">
                      <a href="#">Read More</a>
                      <div className="relative">
                        <div className="icon heart"></div>
                        <div className="hearts-number hide"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </section>
            <div className="social-handle"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default SocialBar;
