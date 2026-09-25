"""Drive all 15 tasks to 100% through the real UI to verify gating logic end-to-end."""
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.action_chains import ActionChains

DEEP = [
    ("T01", "control.profile-form", 42),
    ("T02", "storefront.quick-cart", 42),
    ("T03", "content.image-link-check", 42),
    ("T04", "control.table-approval", 77),
    ("T05", "tickets.reserve-cheapest", 77),
    ("T06", "storefront.checkout-coupon", 19),
    ("T07", "codehost.issue-pr-merge", 31),
    ("T08", "tickets.reserve-team-trip", 31),
    ("T09", "content.publish-campaign", 55),
    ("T10", "browser.upload-download", 42),
    ("T11", "browser.dialog-noise", 77),
    ("T12", "browser.full-stress", 31),
    ("T13", "control-benchmark.atomic-basic", 42),
    ("T14", "control-benchmark.atomic-advanced", 55),
    ("T15", "control-benchmark.composite-scenarios", 31),
]

opts = Options()
opts.add_argument("--headless=new")
opts.add_argument("--window-size=1600,1100")
d = webdriver.Chrome(options=opts)

SETVAL = """
const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
const taSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
const selSetter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set;
const el = arguments[0];
const val = arguments[1];
if (el.tagName === 'TEXTAREA') { taSetter.call(el, val); }
else if (el.tagName === 'SELECT') { selSetter.call(el, val); }
else { setter.call(el, String(val)); }
el.dispatchEvent(new Event('input', { bubbles: true }));
el.dispatchEvent(new Event('change', { bubbles: true }));
"""

def click_text(xpath):
    # 限定在 main-stage 内，避免点到侧边栏任务标签
    full = "//section[contains(@class,'main-stage')]" + xpath.replace("//button", "//button")
    try:
        d.find_element(By.XPATH, full).click()
    except Exception:
        d.find_element(By.XPATH, xpath).click()

def fill_input(css, val):
    el = d.find_element(By.CSS_SELECTOR, css)
    d.execute_script(SETVAL, el, val)

def set_select(css, val):
    el = d.find_element(By.CSS_SELECTOR, css)
    d.execute_script(SETVAL, el, val)

def set_select_el(el, val):
    d.execute_script(SETVAL, el, val)

def set_val_el(el, val):
    d.execute_script(SETVAL, el, val)

def score():
    return d.execute_script("return window.__recordReplayDemo.evaluate().score")

def report(code, tid, seed):
    s = score()
    print(f"{code} {tid} seed={seed} -> score={s}")
    return s

results = {}

# T01 profile-form
_,tid,seed = DEEP[0]
d.get(f"http://127.0.0.1:5173/?task={tid}&seed={seed}")
time.sleep(0.8)
t = d.execute_script("return {n:__.state.target.name,e:__.state.target.email,c:__.state.target.country,r:__.state.target.role,b:__.state.target_budget?__.state.target_budget:__.state.target.budget,news:__.state.target.newsletter}" % {}) if False else d.execute_script("const s=window.__recordReplayDemo.state;return{n:s.target.name,e:s.target.email,c:s.target.country,r:s.target.role,b:s.target.budget,news:s.target.newsletter}")
inputs = d.find_elements(By.CSS_SELECTOR,".form-grid.two input")
inputs[0].send_keys(t["n"]); inputs[1].send_keys(t["e"])
_sels = d.find_elements(By.CSS_SELECTOR,".form-grid.two select")
set_select_el(_sels[0], t["c"]); set_select_el(_sels[1], t["r"])
_r = d.find_element(By.CSS_SELECTOR,".form-grid .wide input[type=range]"); set_val_el(_r, t["b"])
# newsletter
checks=d.find_elements(By.CSS_SELECTOR,".toggle-row input[type=checkbox]")
if t["news"]!=checks[0].is_selected(): checks[0].click()
# terms
if not checks[1].is_selected(): checks[1].click()
d.find_element(By.XPATH,"//button[contains(.,'保存资料')]").click()
time.sleep(0.3); d.find_element(By.XPATH,"//button[contains(.,'评测')]").click(); time.sleep(0.3)
results["T01"]=score()

# T02 storefront quick-cart
_,tid,seed=DEEP[1]
d.get(f"http://127.0.0.1:5173/?task={tid}&seed={seed}"); time.sleep(0.8)
t=d.execute_script("const s=window.__recordReplayDemo.state;return{q:s.target.query,p:s.target.productId,col:s.target.color,sz:s.target.size,qt:s.target.quantity}")
pq=t["q"]; pp=t["p"]; pcol=t["col"]; psz=t["sz"]; pqt=t["qt"]
fill_input(".search-field input", pq); click_text("//button[contains(.,'搜索商品')]"); time.sleep(0.9)
d.execute_script("document.querySelectorAll('.product-card').forEach(c=>{if(c.querySelector('.eyebrow').textContent==='"+pp+"')c.querySelector('button').click()})"); time.sleep(0.3)
sels2=d.find_elements(By.CSS_SELECTOR,".form-grid.two select")
set_select_el(sels2[0], pcol); set_select_el(sels2[1], psz)
_q=d.find_element(By.CSS_SELECTOR,".form-grid.two input[type=number]");set_val_el(_q,pqt)
time.sleep(0.2)
click_text("//button[contains(.,'加入购物车')]")
d.find_element(By.XPATH,"//button[contains(.,'评测')]").click(); time.sleep(0.3)
results["T02"]=score()

# T03 image-link-check
_,tid,seed=DEEP[2]
d.get(f"http://127.0.0.1:5173/?task={tid}&seed={seed}"); time.sleep(0.8)
t=d.execute_script("const s=window.__recordReplayDemo.state;return{img:s.target.imageId,lnk:s.target.linkId}")
img=t["img"]; lnk=t["lnk"]
d.execute_script("document.querySelectorAll('.media-card').forEach(c=>{if(c.querySelector('small').textContent=='"+img+"')c.click()})"); time.sleep(0.2)
d.execute_script("const s=window.__recordReplayDemo.state;document.querySelectorAll('.link-card').forEach((c,i)=>{if(s.links[i].id=='"+lnk+"')c.click()})")
time.sleep(0.2)
click_text("//button[contains(.,'确认图片')]"); time.sleep(0.2)
d.find_element(By.XPATH,"//button[contains(.,'评测')]").click(); time.sleep(0.3)
results["T03"]=score()

# T04 table-approval
_,tid,seed=DEEP[3]
d.get(f"http://127.0.0.1:5173/?task={tid}&seed={seed}"); time.sleep(0.8)
tid_req=d.execute_script("return window.__recordReplayDemo.state.targetRequestId")
click_text("//button[contains(.,'目标')]"); time.sleep(0.2)  # 填入 targetRequestId
# 点击对应行的"选择"
d.execute_script("document.querySelectorAll('.data-row:not(.header)').forEach(r=>{if(r.querySelector('span').textContent=='"+tid_req+"')r.querySelector('button').click()})"); time.sleep(0.2)
d.find_element(By.XPATH,"//div[contains(@class,'toolbar')]//button[contains(.,'审批')]").click(); time.sleep(0.3)
d.find_element(By.CSS_SELECTOR,".modal textarea").send_keys("已完成审批，资料符合要求，准予通过")
click_text("//div[contains(@class,'modal')]//button[contains(.,'确认通过')]"); time.sleep(0.3)
d.find_element(By.XPATH,"//button[contains(.,'评测')]").click(); time.sleep(0.3)
results["T04"]=score()

# T05 ticket
_,tid,seed=DEEP[4]
d.get(f"http://127.0.0.1:5173/?task={tid}&seed={seed}"); time.sleep(0.8)
info=d.execute_script("const s=window.__recordReplayDemo.state;const exp=[...s.trains].filter(t=>t.className===s.target.className&&t.seats>0).sort((a,b)=>a.price-b.price)[0];return{o:s.target.origin,de:s.target.destination,dt:s.target.date,p:s.target.passenger,c:s.target.captchaAnswer,e:exp.id}")
o5=info["o"];de5=info["de"];dt5=info["dt"];p5=info["p"];c5=info["c"];e5=info["e"]
inputs=d.find_elements(By.CSS_SELECTOR,".form-grid.three input")
inputs[0].send_keys(o5);inputs[1].send_keys(de5);inputs[2].send_keys(dt5)
click_text("//button[contains(.,'搜索')]"); time.sleep(0.9)
_el=d.find_element(By.CSS_SELECTOR,".inline-select select");set_select_el(_el,"all"); time.sleep(0.2)
d.execute_script("document.querySelectorAll('.ticket-option').forEach(o=>{if(o.querySelector('strong').textContent=='"+e5+"')o.querySelector('button').click()})"); time.sleep(0.2)
co=d.find_elements(By.CSS_SELECTOR,".panel:nth-of-type(2) input")
co[0].send_keys(p5);co[1].send_keys(str(c5)); time.sleep(0.2)
click_text("//button[contains(.,'预订车票')]"); time.sleep(0.3)
d.find_element(By.XPATH,"//button[contains(.,'评测')]").click(); time.sleep(0.3)
results["T05"]=score()

# T06 checkout-coupon
_,tid,seed=DEEP[5]
d.get(f"http://127.0.0.1:5173/?task={tid}&seed={seed}"); time.sleep(0.8)
t=d.execute_script("const s=window.__recordReplayDemo.state;return{q:s.target.query,p:s.target.productId,col:s.target.color,sz:s.target.size,qt:s.target.quantity,cp:s.target.coupon,rc:s.target.recipient}")
q6=t["q"];p6=t["p"];col6=t["col"];sz6=t["sz"];qt6=t["qt"];cp6=t["cp"];rc6=t["rc"]
fill_input(".search-field input",q6); click_text("//button[contains(.,'搜索商品')]"); time.sleep(0.9)
d.execute_script("document.querySelectorAll('.product-card').forEach(c=>{if(c.querySelector('.eyebrow').textContent.trim()=='"+p6+"')c.querySelector('button').click()})"); time.sleep(0.3)
sels6=d.find_elements(By.CSS_SELECTOR,".form-grid.two select")
set_select_el(sels6[0], col6); set_select_el(sels6[1], sz6)
_q=d.find_element(By.CSS_SELECTOR,".form-grid.two input[type=number]");set_val_el(_q,qt6)
# coupon / recipient / address — 按标签 span 文本定位
def label_input(text_label):
    return d.execute_script("var spans=[...document.querySelectorAll('label > span')].filter(s=>s.textContent==arguments[0]);if(!spans.length) return null; var el=spans[0].closest('label').querySelector('input,textarea');return el;", text_label)
from selenium.webdriver.remote.webelement import WebElement
for txt,val in [("优惠码",cp6),("收件人",rc6)]:
    el=label_input(txt)
    set_val_el(el,val)
addr_el=label_input("收货地址")
set_val_el(addr_el,"测试地址 100 号，深圳市南山区，邮编 518000")
time.sleep(0.2)
click_text("//button[contains(.,'加入购物车')]"); time.sleep(0.2)
click_text("//button[contains(.,'提交订单')]"); time.sleep(0.3)
d.find_element(By.XPATH,"//button[contains(.,'评测')]").click(); time.sleep(0.3)
results["T06"]=score()

# T07 codehost
_,tid,seed=DEEP[6]
d.get(f"http://127.0.0.1:5173/?task={tid}&seed={seed}"); time.sleep(0.8)
t=d.execute_script("const s=window.__recordReplayDemo.state;return{it:s.target.issueTitle,lb:s.target.label,as:s.target.assignee,br:s.target.branch,fp:s.target.filePath}")
d.find_element(By.CSS_SELECTOR,".panel input[type=text]" if False else "input[placeholder]").clear()
d.find_element(By.CSS_SELECTOR,"input[placeholder]").send_keys(t["it"])
_s=d.find_elements(By.CSS_SELECTOR,".form-grid.two select")[0];set_select_el(_s,t["lb"])
_s=d.find_elements(By.CSS_SELECTOR,".form-grid.two select")[1];set_select_el(_s,t["as"])
click_text("//button[contains(.,'创建 Issue')]"); time.sleep(0.2)
# PR panel
pr_inputs=d.find_elements(By.XPATH,"//h2[text()='评审与合并']/following::div[contains(@class,'form-grid')]//input")
pr_inputs[0].send_keys(t["br"]);pr_inputs[1].send_keys(t["fp"])
d.find_element(By.XPATH,"//textarea[@placeholder='描述实现内容']").send_keys("完成实现、测试与回放验收，全部通过")
click_text("//button[contains(.,'创建 PR')]"); time.sleep(0.2)
click_text("//button[contains(.,'Review')]"); time.sleep(0.1)
click_text("//button[contains(.,'检查')]"); time.sleep(0.1)
click_text("//button[contains(.,'合并')]"); time.sleep(0.3)
d.find_element(By.XPATH,"//button[contains(.,'评测')]").click(); time.sleep(0.3)
results["T07"]=score()

# T08 team-trip
_,tid,seed=DEEP[7]
d.get(f"http://127.0.0.1:5173/?task={tid}&seed={seed}"); time.sleep(0.8)
info=d.execute_script("const s=window.__recordReplayDemo.state;const exp=[...s.trains].filter(t=>t.className===s.target.className&&t.seats>0).sort((a,b)=>a.price-b.price)[0];return{o:s.target.origin,de:s.target.destination,dt:s.target.date,p:s.target.passenger,c:s.target.captchaAnswer,e:exp.id}")
o8=info["o"];de8=info["de"];dt8=info["dt"];p8=info["p"];c8=info["c"];e8=info["e"]
inputs=d.find_elements(By.CSS_SELECTOR,".form-grid.three input")
inputs[0].send_keys(o8);inputs[1].send_keys(de8);inputs[2].send_keys(dt8)
click_text("//button[contains(.,'搜索')]"); time.sleep(0.9)
_el=d.find_element(By.CSS_SELECTOR,".inline-select select");set_select_el(_el,"all"); time.sleep(0.2)
d.execute_script("document.querySelectorAll('.ticket-option').forEach(o=>{if(o.querySelector('strong').textContent=='"+e8+"')o.querySelector('button').click()})"); time.sleep(0.2)
co=d.find_elements(By.CSS_SELECTOR,".panel:nth-of-type(2) input")
co[0].send_keys(p8);co[1].send_keys(str(c8)); time.sleep(0.2)
click_text("//button[contains(.,'预订车票')]"); time.sleep(0.3)
d.find_element(By.XPATH,"//button[contains(.,'评测')]").click(); time.sleep(0.3)
results["T08"]=score()

# T09 publish-campaign
_,tid,seed=DEEP[8]
d.get(f"http://127.0.0.1:5173/?task={tid}&seed={seed}"); time.sleep(0.8)
t=d.execute_script("const s=window.__recordReplayDemo.state;return{img:s.target.imageId,lnk:s.target.linkId,kw:s.target.captionKeyword}")
img9=t["img"];lnk9=t["lnk"];kw9=t["kw"]
d.execute_script("document.querySelectorAll('.media-card').forEach(c=>{if(c.querySelector('small').textContent=='"+img9+"')c.click()})"); time.sleep(0.2)
d.execute_script("const s=window.__recordReplayDemo.state;document.querySelectorAll('.link-card').forEach((c,i)=>{if(s.links[i].id=='"+lnk9+"')c.click()})"); time.sleep(0.2)
click_text("//button[contains(.,'确认图片')]"); time.sleep(0.2)
d.find_element(By.CSS_SELECTOR,"textarea[placeholder*='文案']").send_keys("用于"+kw9+"的活动落地页内容")
click_text("//button[contains(.,'发布')]"); time.sleep(0.3)
d.find_element(By.XPATH,"//button[contains(.,'评测')]").click(); time.sleep(0.3)
results["T09"]=score()

# T10 upload-download
_,tid,seed=DEEP[9]
d.get(f"http://127.0.0.1:5173/?task={tid}&seed={seed}"); time.sleep(0.8)
t=d.execute_script("const s=window.__recordReplayDemo.state;return{ut:s.target.uploadType,rf:s.target.reportFormat}")
click_text("//button[contains(.,'下载样例')]"); time.sleep(0.5)
click_text("//button[contains(.,'使用已下载样例')]"); time.sleep(0.3)
_s=d.find_elements(By.CSS_SELECTOR,".form-grid.two select")[0];set_select_el(_s,t["ut"]); time.sleep(0.2)
click_text("//button[contains(.,'解析上传')]"); time.sleep(0.2)
_s=d.find_elements(By.CSS_SELECTOR,".form-grid.two select")[1];set_select_el(_s,t["rf"]); time.sleep(0.2)
click_text("//button[contains(.,'下载报表')]"); time.sleep(0.4)
click_text("//button[contains(.,'提交任务')]"); time.sleep(0.3)
d.find_element(By.XPATH,"//button[contains(.,'评测')]").click(); time.sleep(0.3)
results["T10"]=score()

# T11 dialog-noise
_,tid,seed=DEEP[10]
d.get(f"http://127.0.0.1:5173/?task={tid}&seed={seed}"); time.sleep(0.8)
t=d.execute_script("const s=window.__recordReplayDemo.state;return{ac:s.target.approvalCode,doc:s.target.documentId}")
ac11=t["ac"];doc11=t["doc"]
# 关闭顺序：survey 模态 -> cookie banner -> helper 浮窗
if d.find_elements(By.XPATH,"//button[contains(.,'稍后处理')]"): d.find_element(By.XPATH,"//button[contains(.,'稍后处理')]").click(); time.sleep(0.15)
if d.find_elements(By.XPATH,"//button[contains(.,'知道了')]"): d.find_element(By.XPATH,"//button[contains(.,'知道了')]").click(); time.sleep(0.15)
d.execute_script("var b=document.querySelector('.helper-widget .close-button');if(b)b.click()"); time.sleep(0.15)
click_text("//button[contains(.,'提示')]"); time.sleep(0.2)
click_text("//div[contains(@class,'modal')]//button[contains(.,'知道了')]"); time.sleep(0.2)
click_text("//button[contains(.,'审批码')]"); time.sleep(0.2)
d.find_element(By.CSS_SELECTOR,".modal input[inputmode=numeric]").send_keys(ac11)
click_text("//div[contains(@class,'modal')]//button[contains(.,'验证')]"); time.sleep(0.2)
click_text("//button[contains(.,'确认归档')]"); time.sleep(0.2)
click_text("//div[contains(@class,'modal')]//button[contains(.,'确认')]"); time.sleep(0.2)
d.execute_script("document.querySelectorAll('.document-row').forEach(r=>{if(r.querySelector('strong').textContent=='"+doc11+"')r.click()})"); time.sleep(0.2)
click_text("//button[contains(.,'提交任务')]"); time.sleep(0.3)
d.find_element(By.XPATH,"//button[contains(.,'评测')]").click(); time.sleep(0.3)
results["T11"]=score()

# T12 full-stress
_,tid,seed=DEEP[11]
d.get(f"http://127.0.0.1:5173/?task={tid}&seed={seed}"); time.sleep(0.8)
t=d.execute_script("const s=window.__recordReplayDemo.state;return{ut:s.target.uploadType,rf:s.target.reportFormat,ac:s.target.approvalCode,doc:s.target.documentId,order:s.target.dragOrder,kw:s.target.memoKeyword}")
ut12=t["ut"];rf12=t["rf"];ac12=t["ac"];doc12=t["doc"];order12=list(t["order"]);kw12=t["kw"]
# 干扰
if d.find_elements(By.XPATH,"//button[contains(.,'稍后处理')]"): d.find_element(By.XPATH,"//button[contains(.,'稍后处理')]").click(); time.sleep(0.15)
if d.find_elements(By.XPATH,"//button[contains(.,'知道了')]"): d.find_element(By.XPATH,"//button[contains(.,'知道了')]").click(); time.sleep(0.15)
d.execute_script("var b=document.querySelector('.helper-widget .close-button');if(b)b.click()"); time.sleep(0.15)
# 上传
click_text("//button[contains(.,'下载样例')]"); time.sleep(0.4)
click_text("//button[contains(.,'使用已下载样例')]"); time.sleep(0.3)
_s=d.find_elements(By.CSS_SELECTOR,".form-grid.two select")[0];set_select_el(_s,ut12); time.sleep(0.2)
click_text("//button[contains(.,'解析上传')]"); time.sleep(0.2)
# 弹窗
click_text("//button[contains(.,'提示')]"); time.sleep(0.2)
click_text("//div[contains(@class,'modal')]//button[contains(.,'知道了')]"); time.sleep(0.2)
click_text("//button[contains(.,'审批码')]"); time.sleep(0.2)
d.find_element(By.CSS_SELECTOR,".modal input[inputmode=numeric]").send_keys(ac12)
click_text("//div[contains(@class,'modal')]//button[contains(.,'验证')]"); time.sleep(0.2)
click_text("//button[contains(.,'确认归档')]"); time.sleep(0.2)
click_text("//div[contains(@class,'modal')]//button[contains(.,'确认')]"); time.sleep(0.2)
# 选资料
d.execute_script("document.querySelectorAll('.document-row').forEach(r=>{if(r.querySelector('strong').textContent=='"+doc12+"')r.click()})"); time.sleep(0.2)
# 拖拽排序：用 ActionChains 真实拖拽，相邻交换直到顺序匹配
def drag(src_id, tgt_id):
    els=d.find_elements(By.CSS_SELECTOR,".drag-item")
    src=None;tgt=None
    for el in els:
        small=d.execute_script("return arguments[0].querySelector('small').textContent",el)
        if small==src_id: src=el
        if small==tgt_id: tgt=el
    if not src or not tgt: return False
    ActionChains(d).drag_and_drop(src,tgt).perform()
    return True

for _ in range(20):
    cur=d.execute_script("return window.__recordReplayDemo.state.dragItems.map(i=>i.id)")
    if cur==order12: break
    for i in range(len(order12)):
        if cur[i]!=order12[i]:
            drag(order12[i], cur[i]); break
    time.sleep(0.15)
cur=d.execute_script("return window.__recordReplayDemo.state.dragItems.map(i=>i.id)")
print("  drag order now:", cur, "target:", order12)
_s=d.find_elements(By.CSS_SELECTOR,".form-grid.two select")[1];set_select_el(_s,rf12); time.sleep(0.2)
click_text("//button[contains(.,'下载报表')]"); time.sleep(0.4)
d.find_element(By.CSS_SELECTOR,"textarea[placeholder*='备注']").send_keys("资料"+kw12)
click_text("//button[contains(.,'提交任务')]"); time.sleep(0.3)
d.find_element(By.XPATH,"//button[contains(.,'评测')]").click(); time.sleep(0.3)
results["T12"]=score()

# T13 atomic-basic
_,tid,seed=DEEP[12]
d.get(f"http://127.0.0.1:5173/?task={tid}&seed={seed}"); time.sleep(0.8)
t13=d.execute_script("const s=window.__recordReplayDemo.state;return{tv:s.target.textValue,pv:s.target.passwordValue,rv:s.target.radioValue,sw:s.target.switchOn,sv:s.target.selectValue,sl:s.target.sliderValue}")
# buttons
click_text("//button[@data-testid='button-normal']"); time.sleep(0.15)
click_text("//button[@data-testid='button-delayed']"); time.sleep(0.5)
el=d.find_element(By.CSS_SELECTOR,"button[data-testid='button-double']")
ActionChains(d).double_click(el).perform(); time.sleep(0.15)
# text
inputs=d.find_elements(By.CSS_SELECTOR,".cb-card input[data-testid='input-text']")
fill_input("input[data-testid='input-text']", t13["tv"])
fill_input("input[data-testid='input-password']", t13["pv"])
d.find_element(By.CSS_SELECTOR,"textarea[data-testid='input-textarea']").send_keys("测试")
# radio
d.find_element(By.CSS_SELECTOR,f"input[data-testid='radio-{t13['rv'].lower()}']").click(); time.sleep(0.15)
# checkbox
d.find_element(By.CSS_SELECTOR,"input[data-testid='checkbox-a']").click(); time.sleep(0.15)
# switch
sw=d.find_element(By.CSS_SELECTOR,"input[data-testid='switch-a']")
if t13["sw"]!=sw.is_selected(): sw.click(); time.sleep(0.15)
# select
set_select("select[data-testid='select-native']", t13["sv"]); time.sleep(0.15)
# slider
_slider = d.find_element(By.CSS_SELECTOR,"input[data-testid='slider']"); set_val_el(_slider, t13["sl"]); time.sleep(0.15)
# modal
click_text("//button[@data-testid='modal-open']"); time.sleep(0.15)
click_text("//button[@data-testid='modal-confirm']"); time.sleep(0.15)
# tab
click_text("//button[@data-testid='tab-2']"); time.sleep(0.15)
d.find_element(By.XPATH,"//button[contains(.,'评测')]").click(); time.sleep(0.3)
results["T13"]=score()

# T14 atomic-advanced
_,tid,seed=DEEP[13]
d.get(f"http://127.0.0.1:5173/?task={tid}&seed={seed}"); time.sleep(0.8)
t14=d.execute_script("const s=window.__recordReplayDemo.state;return{av:s.target.autocompleteValue,dv:s.target.dateValue,sv:s.target.shadowValue,st:s.target.scrollTarget,pt:s.target.paginationTarget}")
# autocomplete - type and select exact match
fill_input("input[data-testid='autocomplete-input']", "北"); time.sleep(0.2)
d.execute_script("document.querySelectorAll('.suggestions div').forEach(d=>{if(d.dataset.value=='"+t14["av"]+"')d.click()})"); time.sleep(0.15)
# date
fill_input("input[data-testid='input-date']", t14["dv"]); time.sleep(0.15)
# drag & drop - use DOM drag events with DataTransfer for headless Chrome reliability
src=d.find_element(By.CSS_SELECTOR,"div[data-testid='drag-source']")
tgt=d.find_element(By.CSS_SELECTOR,"div[data-testid='drop-target']")
d.execute_script("""
const src=arguments[0];
const tgt=arguments[1];
const dt=new DataTransfer();
src.dispatchEvent(new DragEvent('dragstart',{bubbles:true,cancelable:true,dataTransfer:dt}));
tgt.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer:dt}));
tgt.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:dt}));
""", src, tgt); time.sleep(0.2)
# canvas - dispatch at the rendered circle center (120,80 in 420x160 canvas)
cv=d.find_element(By.CSS_SELECTOR,"canvas[data-testid='canvas']")
d.execute_script("""
const c=arguments[0];
c.scrollIntoView({block:'center'});
const r=c.getBoundingClientRect();
c.dispatchEvent(new MouseEvent('click',{
  bubbles:true,
  clientX:r.left+120*(r.width/420),
  clientY:r.top+80*(r.height/160)
}));
""", cv); time.sleep(0.15)
# svg circle - click via client coordinates to avoid viewport/offset drift
svg=d.find_element(By.CSS_SELECTOR,"[data-testid='svg-circle']")
d.execute_script("""
const el=arguments[0];
el.scrollIntoView({block:'center'});
const r=el.getBoundingClientRect();
el.dispatchEvent(new MouseEvent('click',{
  bubbles:true,
  clientX:r.left+r.width/2,
  clientY:r.top+r.height/2
}));
""", svg); time.sleep(0.15)
# shadow DOM
d.execute_script("const host=document.querySelector('[data-testid=shadow-host]');const sr=host.shadowRoot;sr.getElementById('sInput').value='"+t14["sv"]+"';sr.getElementById('sBtn').click()"); time.sleep(0.15)
# infinite scroll - find and click target
d.execute_script("const box=document.querySelector('[data-testid=infinite-scroll]');const target='"+t14["st"]+"';let found=false;for(const child of box.children){if(child.textContent===target){child.click();found=true;break;}}if(!found){box.scrollTop=box.scrollHeight;}"); time.sleep(0.2)
d.execute_script("const box=document.querySelector('[data-testid=infinite-scroll]');const target='"+t14["st"]+"';for(const child of box.children){if(child.textContent===target){child.click();break;}}"); time.sleep(0.15)
# table sort
click_text("//button[@data-testid='table-sort']"); time.sleep(0.15)
# pagination - go to page 4
for _ in range(3):
    click_text("//button[@data-testid='page-next']"); time.sleep(0.15)
# accordion
click_text("//button[@data-testid='accordion-toggle']"); time.sleep(0.15)
d.find_element(By.XPATH,"//button[contains(.,'评测')]").click(); time.sleep(0.3)
results["T14"]=score()

# T15 composite-scenarios
_,tid,seed=DEEP[14]
d.get(f"http://127.0.0.1:5173/?task={tid}&seed={seed}"); time.sleep(0.8)
t15=d.execute_script("const s=window.__recordReplayDemo.state;return{sn:s.target.scenarioName,st:s.target.scenarioType,sd:s.target.scenarioDate,sr:s.target.scenarioRegion,sa:s.target.scenarioAmount}")
# S01: form query
fill_input("input[data-testid='s1-name']", t15["sn"]); time.sleep(0.1)
set_select("select[data-testid='s1-type']", t15["st"]); time.sleep(0.1)
fill_input("input[data-testid='s1-date']", t15["sd"]); time.sleep(0.1)
click_text("//button[@data-testid='s1-search']"); time.sleep(0.3)
# S03: async list
set_select("select[data-testid='s3-region']", t15["sr"]); time.sleep(0.1)
click_text("//button[@data-testid='s3-load']"); time.sleep(0.3)
# S04: paginated search - click next until found
for _ in range(4):
    click_text("//button[@data-testid='s4-next']"); time.sleep(0.2)
# S11: idempotent payment — correct amount, then verify the second confirmation is blocked
fill_input("input[data-testid='s11-amount']", str(t15["sa"])); time.sleep(0.1)
click_text("//button[@data-testid='s11-pay']"); time.sleep(0.15)
click_text("//button[@data-testid='risk-confirm']"); time.sleep(0.3)
click_text("//button[@data-testid='s11-pay']"); time.sleep(0.15)
click_text("//button[@data-testid='risk-confirm']"); time.sleep(0.3)
# S12: complete the underlying Shadow DOM, Canvas, and SVG controls before checking the flags
shadow_value = "SHADOW-123"
d.execute_script("const host=document.querySelector('[data-testid=shadow-host]');const sr=host.shadowRoot;sr.getElementById('sInput').value=arguments[0];sr.getElementById('sBtn').click()", shadow_value)
time.sleep(0.2)
canvas = d.find_element(By.CSS_SELECTOR, "canvas[data-testid='canvas']")
d.execute_script("""
const c=arguments[0]; c.scrollIntoView({block:'center'}); const r=c.getBoundingClientRect();
c.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:r.left+120*(r.width/420),clientY:r.top+80*(r.height/160)}));
""", canvas)
time.sleep(0.2)
svg_circle = d.find_element(By.CSS_SELECTOR, "[data-testid='svg-circle']")
d.execute_script("""
const el=arguments[0]; const r=el.getBoundingClientRect();
el.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:r.left+r.width/2,clientY:r.top+r.height/2}));
""", svg_circle)
time.sleep(0.2)
s12_checks = [
    d.find_element(By.CSS_SELECTOR, f"input[data-testid='s12-{name}']")
    for name in ("shadow", "canvas", "svg")
]
for cb in s12_checks:
    if not cb.is_selected(): d.execute_script("arguments[0].click()", cb)
click_text("//button[@data-testid='s12-check']"); time.sleep(0.3)
d.find_element(By.XPATH,"//button[contains(.,'评测')]").click(); time.sleep(0.3)
results["T15"]=score()

d.quit()
print("\n===== RESULTS =====")
for k in sorted(results): print(f"{k}: {results[k]}")
if all(v==1 for v in results.values()):
    print("T01: 1  T02: 1  T03: 1  T04: 1  T05: 1  T06: 1")
    print("T07: 1  T08: 1  T09: 1  T10: 1  T11: 1  T12: 1")
    print("T13: 1  T14: 1  T15: 1")
    print("ALL PASS")
else:
    print("SOME FAILED")
    raise SystemExit(1)
