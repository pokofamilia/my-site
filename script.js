/* script.js */
document.addEventListener("DOMContentLoaded", () => {
    const worksContainer = document.getElementById("works-container");

    // works.jsonをfetchで取得
    fetch("public/works.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("ネットワークエラーが発生しました");
            }
            return response.json();
        })
        .then(data => {
            // データをループで回して要素を生成
            data.forEach(work => {
                // 技術タグのHTML文字列を生成
                const tagsHtml = work.technologies
                    .map(tech => `<span class="tag">${tech}</span>`)
                    .join("");

                // 画像がない場合のフォールバック用に onerror を指定
                const cardHtml = `
                    <a href="${work.url}" target="_blank" rel="noopener noreferrer" class="work-card fade-in">
                        <div class="work-img-wrapper">
                            <img 
                                src="${work.image}" 
                                alt="${work.title}" 
                                class="work-img"
                                onerror="this.onerror=null; this.src='public/images/noimage.png';"
                            >
                        </div>
                        <div class="work-info">
                            <h3 class="work-title">${work.title}</h3>
                            <p class="work-desc">${work.description}</p>
                            <div class="work-tags">
                                ${tagsHtml}
                            </div>
                        </div>
                    </a>
                `;
                
                // コンテナにカードを追加
                worksContainer.insertAdjacentHTML("beforeend", cardHtml);
            });

            // 追加されたカードに対してもフェードインを監視する
            document.querySelectorAll("#works-container .fade-in").forEach(el => observer.observe(el));
        })
        .catch(error => {
            console.error("データの取得に失敗しました:", error);
            // JSON取得失敗時のエラー表示
            worksContainer.innerHTML = `<p class="error-msg fade-in">作品を読み込めませんでした</p>`;
        });

    // --- フェードインアニメーションの実装 ---
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15 // 要素が15%画面に入ったら発火
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target); // 一度発火したら監視を解除する
            }
        });
    }, observerOptions);

    // 最初からHTMLにある fade-in 要素を監視
    document.querySelectorAll(".fade-in").forEach(el => {
        observer.observe(el);
    });
});
